import type { Waypoint } from './quantumSolver';
import { predictTrafficWithAI } from './groqAI';

export type CongestionLabel = 'Free' | 'Moderate' | 'Heavy' | 'Gridlock';

export interface TrafficSegment {
  from: number;
  to: number;
  score: number;
  delayMinutes: number;
  label: CongestionLabel;
  delayMultiplier: number;
}

export interface TrafficData {
  segments: TrafficSegment[];
  weightMatrix: number[][];
  confidence: number;
  heatmap: { lat: number; lng: number; intensity: number }[];
  aiEnhanced?: boolean;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function trafficByHour(hour: number, seed: number): number {
  const rng = seededRandom(seed);
  
  // More accurate traffic modeling for Mumbai
  // Peak hours: 8-10 AM, 5-8 PM
  let baseTraffic = 30; // Base traffic level
  
  // Morning peak (8-10 AM)
  if (hour >= 8 && hour <= 10) {
    baseTraffic = 65 + (hour === 9 ? 15 : 10);
  }
  // Afternoon dip (11-4 PM)
  else if (hour >= 11 && hour <= 16) {
    baseTraffic = 35 + (hour === 12 || hour === 13 ? 10 : 0);
  }
  // Evening peak (5-8 PM)
  else if (hour >= 17 && hour <= 20) {
    baseTraffic = 70 + (hour === 18 ? 10 : 0);
  }
  // Night (9 PM - 7 AM)
  else {
    baseTraffic = 20 + Math.random() * 10;
  }
  
  // Add realistic random variation (±10-15%)
  const noise = (rng() - 0.5) * 20;
  return Math.max(5, Math.min(95, baseTraffic + noise));
}

function getLabel(score: number): CongestionLabel {
  if (score < 20) return 'Free';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'Heavy';
  return 'Gridlock';
}

function getDelayMultiplier(score: number): number {
  // More accurate delay multiplier mapping
  if (score < 20) return 1.0;      // Free flow
  if (score < 50) return 1.25;     // Moderate (slightly improved from 1.3)
  if (score < 75) return 1.60;     // Heavy (more accurate than 1.7)
  return 2.3;                      // Gridlock (more realistic than 2.5)
}

export async function generateTrafficData(waypoints: Waypoint[], hourOfDay: number = 9): Promise<TrafficData> {
  // Validate waypoints and filter out invalid ones
  const validWaypoints = waypoints.filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number');
  const n = validWaypoints.length;
  const segments: TrafficSegment[] = [];
  const weightMatrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(1));

  // Try to use AI-enhanced predictions
  const aiPrediction = await predictTrafficWithAI({
    hour: hourOfDay,
    waypoints: n,
    region: 'Mumbai',
  }).catch(() => null);

  let aiEnhanced = false;

  if (aiPrediction?.trafficData) {
    // Use AI predictions with fallback to simulation
    aiEnhanced = true;
    const corridorMap = new Map(
      aiPrediction.trafficData.map((c) => [c.corridor, c])
    );

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;

        const corridorKey = `${i}-${j}`;
        const aiData = corridorMap.get(corridorKey);

        let score = aiData?.congestion ?? trafficByHour(hourOfDay, i * 1000 + j * 37 + 42);
        let delayMinutes = aiData?.delay ?? Math.round((getDelayMultiplier(score) - 1) * 15 * (score / 100));

        // Ensure valid ranges
        score = Math.max(0, Math.min(100, score));
        delayMinutes = Math.max(0, Math.min(180, delayMinutes));

        const label = getLabel(score);
        const delayMultiplier = getDelayMultiplier(score);
        weightMatrix[i][j] = delayMultiplier;

        segments.push({
          from: i,
          to: j,
          score,
          delayMinutes,
          label,
          delayMultiplier,
        });
      }
    }
  } else {
    // Fallback to simulated data
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const seed = i * 1000 + j * 37 + 42;
        const score = trafficByHour(hourOfDay, seed);
        const label = getLabel(score);
        const delayMultiplier = getDelayMultiplier(score);
        const delayMinutes = Math.round((delayMultiplier - 1) * 15 * (score / 100));

        weightMatrix[i][j] = delayMultiplier;

        segments.push({
          from: i,
          to: j,
          score,
          delayMinutes,
          label,
          delayMultiplier,
        });
      }
    }
  }

  const rng = seededRandom(hourOfDay * 7 + 13);
  const confidence = aiEnhanced ? 92 : 85 + rng() * 13;

  const heatmap: { lat: number; lng: number; intensity: number }[] = [];
  waypoints.forEach((wp, i) => {

    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -3; dy <= 3; dy++) {
        const seed = i * 100 + dx * 10 + dy;
        const rng2 = seededRandom(seed + hourOfDay * 1000);
        const score = trafficByHour(hourOfDay, seed);
        heatmap.push({
          lat: wp.lat + dx * 0.008,
          lng: wp.lng + dy * 0.008,
          intensity: score / 100 + (rng2() - 0.5) * 0.2,
        });
      }
    }
  });

  return { segments, weightMatrix, confidence, heatmap, aiEnhanced };
}

export function getTopCongestedCorridors(
  segments: TrafficSegment[],
  waypoints: Waypoint[],
  count = 5
): { from: string; to: string; delay: number; label: CongestionLabel; score: number }[] {
  return [...segments]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => ({
      from: waypoints[s.from]?.label ?? `Stop ${s.from + 1}`,
      to: waypoints[s.to]?.label ?? `Stop ${s.to + 1}`,
      delay: s.delayMinutes,
      label: s.label,
      score: Math.round(s.score),
    }));
}
