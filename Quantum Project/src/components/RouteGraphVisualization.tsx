import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import type { Waypoint, SolverResult } from '../lib/quantumSolver';

interface RouteGraphProps {
  waypoints: Waypoint[];
  solverResult: SolverResult | null;
  isSolving: boolean;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function calculateInitialDistance(waypoints: Waypoint[]): number {
  // Filter out invalid waypoints first
  const validWaypoints = waypoints.filter((w): w is Waypoint => 
    w !== undefined && 
    w !== null && 
    typeof w.lat === 'number' && 
    typeof w.lng === 'number'
  );
  
  if (validWaypoints.length < 2) return 0;
  
  let distance = 0;
  for (let i = 0; i < validWaypoints.length; i++) {
    const from = validWaypoints[i];
    const to = validWaypoints[(i + 1) % validWaypoints.length];
    distance += haversineDistance(from.lat, from.lng, to.lat, to.lng);
  }
  return distance;
}

export default function RouteGraphVisualization({ waypoints, solverResult, isSolving }: RouteGraphProps) {
  // Filter valid waypoints from the start
  const validWaypoints = waypoints.filter((w): w is Waypoint => 
    w !== undefined && 
    w !== null && 
    typeof w.lat === 'number' && 
    typeof w.lng === 'number'
  );

  const initialDistance = useMemo(() => calculateInitialDistance(validWaypoints), [validWaypoints]);
  const finalDistance = solverResult?.totalDistance || 0;
  const improvement = initialDistance - finalDistance;
  const improvementPercent = initialDistance > 0 ? (improvement / initialDistance) * 100 : 0;

  // Calculate bounds for graph
  const bounds = useMemo(() => {
    if (validWaypoints.length === 0) return { minLat: 19, maxLat: 19, minLng: 73, maxLng: 73 };
    
    const lats = validWaypoints.map(w => w.lat);
    const lngs = validWaypoints.map(w => w.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [validWaypoints]);

  // Convert lat/lng to pixel coordinates for SVG
  const getCoords = (wp: Waypoint | undefined): { x: number; y: number } | null => {
    if (!wp || typeof wp.lat !== 'number' || typeof wp.lng !== 'number') {
      return null;
    }
    
    const padding = 40;
    const width = 400 - padding * 2;
    const height = 300 - padding * 2;
    const latRange = bounds.maxLat - bounds.minLat || 0.1;
    const lngRange = bounds.maxLng - bounds.minLng || 0.1;

    const x = padding + ((wp.lng - bounds.minLng) / lngRange) * width;
    const y = padding + ((bounds.maxLat - wp.lat) / latRange) * height;
    return { x, y };
  };

  if (validWaypoints.length < 2) {
    return (
      <Card sx={{ bgcolor: 'rgba(15,23,42,0.5)', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            Add at least 2 locations to visualize route graph
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const initialTour = validWaypoints.map((_, i) => i);
  const optimizedTour = solverResult?.tour || initialTour;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      {/* Initial Route Graph */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card sx={{ bgcolor: 'rgba(15,23,42,0.5)', border: '1px solid', borderColor: 'rgba(148,163,184,0.2)', borderRadius: 2, h: '100%' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#CCCCCC' }}>
                Initial Route
              </Typography>
              <Chip label="Random" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'rgba(148,163,184,0.1)', color: '#CCCCCC' }} />
            </Box>

            {/* SVG Graph */}
            <Box component="svg" width="100%" height="280" viewBox="0 0 400 300" sx={{ mb: '12px' }}>
              {/* Draw edges - Initial tour */}
              {initialTour.map((from, i) => {
                const to = initialTour[(i + 1) % initialTour.length];
                const fromCoords = getCoords(waypoints[from]);
                const toCoords = getCoords(waypoints[to]);
                if (!fromCoords || !toCoords) return null;
                return (
                  <line
                    key={`edge-${i}`}
                    x1={fromCoords.x}
                    y1={fromCoords.y}
                    x2={toCoords.x}
                    y2={toCoords.y}
                    stroke="#64748B"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                );
              })}

              {/* Draw nodes */}
              {waypoints.map((wp, i) => {
                const coords = getCoords(wp);
                if (!coords) return null;
                return (
                  <g key={`node-${i}`}>
                    <circle cx={coords.x} cy={coords.y} r="6" fill="#64748B" opacity="0.8" />
                    <circle cx={coords.x} cy={coords.y} r="10" fill="#64748B" opacity="0.2" />
                    <text
                      x={coords.x}
                      y={coords.y + 16}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="Inter, sans-serif"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Distance</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#CCCCCC', mt: 0.25 }}>
                  {initialDistance.toFixed(1)} km
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Stops</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#CCCCCC', mt: 0.25 }}>
                  {waypoints.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Optimized Route Graph */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card
          sx={{
            bgcolor: solverResult ? 'rgba(16,185,129,0.08)' : 'rgba(15,23,42,0.5)',
            border: '1px solid',
            borderColor: solverResult ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.2)',
            borderRadius: 2,
            h: '100%',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: solverResult ? '#10B981' : '#CCCCCC' }}>
                {solverResult ? 'Optimized Route' : 'Solve to Optimize'}
              </Typography>
              <Chip
                label={solverResult ? '✓ Optimized' : isSolving ? 'Solving...' : 'Pending'}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  bgcolor: solverResult ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.1)',
                  color: solverResult ? '#10B981' : '#CCCCCC',
                }}
              />
            </Box>

            {/* SVG Graph */}
            <Box component="svg" width="100%" height="280" viewBox="0 0 400 300" sx={{ mb: '12px' }}>
              {/* Draw edges - Optimized tour */}
              {optimizedTour.map((from, i) => {
                const to = optimizedTour[(i + 1) % optimizedTour.length];
                const fromCoords = getCoords(waypoints[from]);
                const toCoords = getCoords(waypoints[to]);
                if (!fromCoords || !toCoords) return null;
                return (
                  <motion.line
                    key={`opt-edge-${i}`}
                    x1={fromCoords.x}
                    y1={fromCoords.y}
                    x2={toCoords.x}
                    y2={toCoords.y}
                    stroke={solverResult ? '#10B981' : '#94A3B8'}
                    strokeWidth="2"
                    opacity={solverResult ? 0.9 : 0.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: solverResult ? 1 : 0 }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                  />
                );
              })}

              {/* Draw nodes */}
              {waypoints.map((_, i) => {
                const coords = getCoords(waypoints[solverResult ? optimizedTour[i] : i]);
                if (!coords) return null;
                return (
                  <motion.g
                    key={`opt-node-${i}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <circle cx={coords.x} cy={coords.y} r="6" fill={solverResult ? '#10B981' : '#94A3B8'} opacity="0.9" />
                    <circle cx={coords.x} cy={coords.y} r="10" fill={solverResult ? '#10B981' : '#94A3B8'} opacity="0.2" />
                    <text
                      x={coords.x}
                      y={coords.y + 16}
                      textAnchor="middle"
                      fill={solverResult ? '#10B981' : '#94A3B8'}
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="Inter, sans-serif"
                    >
                      {(solverResult ? optimizedTour.indexOf(i) : i) + 1}
                    </text>
                  </motion.g>
                );
              })}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Distance</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: solverResult ? '#10B981' : '#CCCCCC', mt: 0.25 }}>
                  {solverResult ? finalDistance.toFixed(1) : '—'} km
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Improvement</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: improvement > 0 ? '#10B981' : '#CCCCCC', mt: 0.25 }}>
                  {solverResult ? improvementPercent.toFixed(1) : '—'}%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Comparison */}
      {solverResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ gridColumn: '1 / -1' }}
        >
          <Card sx={{ bgcolor: 'rgba(37,99,235,0.08)', border: '1px solid', borderColor: 'rgba(37,99,235,0.3)', borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#2563EB' }}>
                📊 Route Optimization Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1.5 }}>
                {[
                  { label: 'Distance Saved', value: `${improvement.toFixed(1)} km`, icon: '📍' },
                  { label: 'Efficiency Gain', value: `${improvementPercent.toFixed(1)}%`, icon: '⚡' },
                  { label: 'Route Sequence', value: `${optimizedTour.map(i => i + 1).join(' → ')}`, icon: '🔄' },
                  { label: 'Total Waypoints', value: waypoints.length.toString(), icon: '📌' },
                ].map((item) => (
                  <Box key={item.label}>
                    <Typography variant="caption" color="text.secondary">
                      {item.icon} {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2563EB', mt: 0.5 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}
