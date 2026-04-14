import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EnergyChart from '../components/EnergyChart';
import { solveQuantum } from '../lib/quantumSolver';
import { analyzeRouteWithAI } from '../lib/groqAI';
import type { Waypoint } from '../lib/quantumSolver';
import { useStore } from '../store/useStore';
import { haversineDistance } from '../lib/utils';
import { VEHICLE_PROFILES } from '../lib/energyConservation';

function generateNodePositions(count: number) {
  if (count <= 0) return [] as { x: number; y: number }[];

  const radius = count <= 3 ? 22 : count <= 6 ? 28 : 32;
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });
}

const PHASES = [
  {
    title: 'Initialization',
    description:
      'We start with a random tour connecting all cities. This is our initial solution — far from optimal but a valid starting point for the annealing process.',
    color: '#64748B',
  },
  {
    title: 'High Temperature Phase',
    description:
      'At high temperature, the algorithm freely accepts both better and worse solutions. This prevents getting stuck in local minima by exploring the full solution space.',
    color: '#F59E0B',
  },
  {
    title: 'Cooling Phase',
    description:
      'As temperature drops, the acceptance probability for worse solutions decreases. The algorithm gradually refines the tour, making fewer and fewer uphill moves.',
    color: '#2563EB',
  },
  {
    title: 'Convergence',
    description:
      'At low temperature, only improvements are accepted. The algorithm has converged to the optimal or near-optimal solution — the shortest possible route.',
    color: '#10B981',
  },
];

interface AnimatedEdge {
  from: number;
  to: number;
  active: boolean;
  optimal: boolean;
}

function QuantumGraph({
  waypoints,
  edges,
  phase,
  progress,
}: {
  waypoints: Waypoint[];
  edges: AnimatedEdge[];
  phase: number;
  progress: number;
}) {
  const nodePositions = generateNodePositions(waypoints.length);
  const n = nodePositions.length;
  const allEdges: { from: number; to: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      allEdges.push({ from: i, to: j });
    }
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {allEdges.map((e, i) => {
        const active = edges.some((ae) => (ae.from === e.from && ae.to === e.to) || (ae.from === e.to && ae.to === e.from));
        const optimal = edges.find((ae) => (ae.from === e.from && ae.to === e.to) || (ae.from === e.to && ae.to === e.from))?.optimal;
        const a = nodePositions[e.from];
        const b = nodePositions[e.to];
        return (
          <motion.line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={optimal ? '#10B981' : active ? '#2563EB' : '#1E3A5F'}
            strokeWidth={optimal ? '0.8' : active ? '0.5' : '0.2'}
            strokeOpacity={optimal ? 0.9 : active ? 0.7 : 0.3}
            animate={{
              strokeOpacity: active ? [0.5, 1, 0.5] : 0.2,
              stroke: optimal ? '#10B981' : active ? PHASES[phase]?.color ?? '#2563EB' : '#1E3A5F',
            }}
            transition={{ duration: 1.2, repeat: active ? Infinity : 0, repeatType: 'reverse' }}
          />
        );
      })}

      {nodePositions.map((node, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="2.5"
            fill={PHASES[phase]?.color ?? '#2563EB'}
            animate={{
              r: [2.5, 3, 2.5],
              fillOpacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              repeat: Infinity,
            }}
          />
          <circle cx={node.x} cy={node.y} r="5" fill={PHASES[phase]?.color ?? '#2563EB'} fillOpacity="0.1" />
          <text
            x={node.x}
            y={node.y + 8}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="3"
            fontFamily="Inter, sans-serif"
          >
            {waypoints[i]?.label?.split(' ')[0] ?? `Stop ${i + 1}`}
          </text>
        </motion.g>
      ))}

      {progress > 10 && (
        <motion.text
          x="50"
          y="96"
          textAnchor="middle"
          fill="#64748B"
          fontSize="2.5"
          fontFamily="Inter, monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Temperature: {Math.max(0, 100 - progress).toFixed(1)}° · Steps: {Math.round((progress / 100) * 5000)}
        </motion.text>
      )}
    </svg>
  );
}

interface AnalysisMetrics {
  initialDistance: number;
  finalDistance: number;
  improvement: number;
  improvementPercent: number;
  executionTime: number;
  finalEnergy: number;
  initialEnergy: number;
  acceptanceRate: number;
  optimalityGap: number;
  co2Saved?: number;
  energySaved?: number;
  aiAnalysis?: {
    analysis: string;
    recommendations: string[];
    estimatedSavings: {
      time: number;
      co2: number;
    };
    confidence: number;
  };
}

export default function VisualizerPage() {
  const storedWaypoints = useStore((state) => state.waypoints);
  const waypoints = useMemo(
    () => storedWaypoints.filter((waypoint) => waypoint && typeof waypoint.lat === 'number' && typeof waypoint.lng === 'number'),
    [storedWaypoints]
  );
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [energyData, setEnergyData] = useState<{ step: number; energy: number }[]>([]);
  const [edges, setEdges] = useState<AnimatedEdge[]>([]);
  const [completed, setCompleted] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisMetrics | null>(null);
  const progressRef = useRef(0);
  const runningRef = useRef(false);
  const startTimeRef = useRef(0);

  const buildInitialEdges = useCallback((): AnimatedEdge[] => {
    const tour = waypoints.map((_, i) => i);
    if (tour.length < 2) return [];
    return tour.map((from, i) => ({ from, to: tour[(i + 1) % tour.length], active: true, optimal: false }));
  }, [waypoints]);

  const calculateDistance = useCallback((waypoints: Waypoint[], tour: number[]): number => {
    let distance = 0;
    for (let i = 0; i < tour.length; i++) {
      const from = waypoints[tour[i]];
      const to = waypoints[tour[(i + 1) % tour.length]];
      // Use accurate Haversine formula instead of rough degree-to-km conversion
      distance += haversineDistance(from.lat, from.lng, to.lat, to.lng, 'urban');
    }
    return distance;
  }, []);

  useEffect(() => {
    setEdges(buildInitialEdges());
  }, [buildInitialEdges]);

  useEffect(() => {
    if (!isRunning && !completed) {
      setEdges(buildInitialEdges());
    }
  }, [waypoints, buildInitialEdges, isRunning, completed]);

  const runAnimation = useCallback(async () => {
    setIsRunning(true);
    setCompleted(false);
    setProgress(0);
    setPhase(0);
    setEnergyData([]);
    setAnalysis(null);

    if (waypoints.length < 2) {
      runningRef.current = false;
      setIsRunning(false);
      setCompleted(false);
      return;
    }

    progressRef.current = 0;
    runningRef.current = true;
    startTimeRef.current = performance.now();

    const collected: { step: number; energy: number }[] = [];
    let initialEnergy = 0;
    let finalEnergy = 0;
    let initialTour: number[] = [];
    let finalTour: number[] = [];
    let acceptedMoves = 0;
    let totalMoves = 0;

    await new Promise<void>((resolve) => {
      let started = false;
      const solve = () => {
        if (!started) {
          started = true;
          solveQuantum(waypoints, undefined, (p) => {
            if (!runningRef.current) return;
            
            if (initialEnergy === 0) initialEnergy = p.energy;
            finalEnergy = p.energy;
            if (initialTour.length === 0) initialTour = [...p.tour];
            finalTour = [...p.tour];
            
            if (p.step % 100 === 0) acceptedMoves++;
            totalMoves++;
            
            progressRef.current = (p.step / 5000) * 100;
            setProgress(progressRef.current);
            collected.push({ step: p.step, energy: p.energy });
            setEnergyData([...collected]);

            const pct = progressRef.current;
            const newPhase = pct < 25 ? 1 : pct < 60 ? 2 : 3;
            setPhase(newPhase);

            const n = waypoints.length;
            const tourEdges: AnimatedEdge[] = p.tour.slice(0, n).map((from, i) => ({
              from,
              to: p.tour[(i + 1) % n],
              active: true,
              optimal: pct > 80,
            }));
            setEdges(tourEdges);
          });
          resolve();
        }
      };
      setTimeout(solve, 100);
    });

    const executionTime = performance.now() - startTimeRef.current;
    const initialDistance = calculateDistance(waypoints, initialTour);
    const finalDistance = calculateDistance(waypoints, finalTour);
    const improvement = initialDistance - finalDistance;
    const improvementPercent = (improvement / initialDistance) * 100;

    // Calculate CO2 and energy savings using CNG car profile as default
    const defaultVehicle = VEHICLE_PROFILES.cng_car;
    const initialFuelConsumed = initialDistance * defaultVehicle.fuelConsumption;
    const finalFuelConsumed = finalDistance * defaultVehicle.fuelConsumption;
    const initialCO2 = initialFuelConsumed * defaultVehicle.co2EmissionFactor;
    const finalCO2 = finalFuelConsumed * defaultVehicle.co2EmissionFactor;
    const co2Saved = initialCO2 - finalCO2;
    const energySaved = improvement * defaultVehicle.fuelConsumption * 12.5; // CNG energy factor

    const metrics: AnalysisMetrics = {
      initialDistance,
      finalDistance,
      improvement,
      improvementPercent,
      executionTime: executionTime / 1000, // Convert to seconds
      finalEnergy,
      initialEnergy,
      acceptanceRate: (acceptedMoves / totalMoves) * 100,
      optimalityGap: ((finalDistance - initialDistance) / Math.max(initialDistance, finalDistance)) * 100,
      co2Saved,
      energySaved,
    };

    // Fetch AI analysis
    const aiAnalysis = await analyzeRouteWithAI({
      distance: finalDistance,
      waypoints: waypoints.length,
      optimization: 'quantum',
      trafficEnabled: false,
    }).catch(() => null);

    if (aiAnalysis) {
      metrics.aiAnalysis = aiAnalysis;
    }

    setAnalysis(metrics);
    runningRef.current = false;
    setIsRunning(false);
    setCompleted(true);
    setPhase(3);
  }, [calculateDistance, waypoints]);

  const handleReplay = useCallback(() => {
    runningRef.current = false;
    setCompleted(false);
    setProgress(0);
    setPhase(0);
    setEnergyData([]);
    setAnalysis(null);
    setEdges(buildInitialEdges());
    setTimeout(() => runAnimation(), 100);
  }, [runAnimation, buildInitialEdges]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: 'calc(100vh - 64px)', display: 'flex' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 400, lg: 'auto' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Quantum Annealing Visualizer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Watch the TSP solver converge in real-time
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isRunning && !completed && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={runAnimation}
                >
                  Run Animation
                </Button>
              )}
              {(isRunning || completed) && (
                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={handleReplay}
                  sx={{ borderColor: 'rgba(37,99,235,0.4)', color: 'primary.light' }}
                >
                  Replay
                </Button>
              )}
            </Box>
          </Box>

          {isRunning && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Annealing progress
                </Typography>
                <Typography variant="caption" color="primary.light">
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 6 }} />
            </Box>
          )}

          <Box
            sx={{
              flex: 1,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 300,
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0, p: 2 }}>
              <QuantumGraph waypoints={waypoints} edges={edges} phase={phase} progress={progress} />
            </Box>

            {!isRunning && !completed && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(15,23,42,0.7)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Press &quot;Run Animation&quot; to start
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Visualizes simulated quantum annealing on your current route locations
                  </Typography>
                </Box>
              </Box>
            )}

            {completed && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                }}
              >
                <Chip
                  label="OPTIMAL ROUTE FOUND"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16,185,129,0.2)',
                    color: 'secondary.main',
                    fontWeight: 700,
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                />
              </Box>
            )}
          </Box>

          {energyData.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Energy Convergence
              </Typography>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <EnergyChart data={energyData} height={160} />
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: { xs: '100%', lg: 340 },
            borderLeft: { lg: '1px solid' },
            borderTop: { xs: '1px solid', lg: 'none' },
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 3,
            overflowY: 'auto',
          }}
        >
          <Typography variant="overline" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            Annealing Phases
          </Typography>

          <AnimatePresence>
            {PHASES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: phase === i ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    mb: 2,
                    bgcolor: phase === i ? 'rgba(15,23,42,0.8)' : 'rgba(15,23,42,0.3)',
                    border: '1px solid',
                    borderColor: phase === i ? `${p.color}44` : 'divider',
                    borderRadius: 2,
                    transition: 'all 300ms ease',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: p.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: phase === i ? 'text.primary' : 'text.secondary' }}
                      >
                        {i}. {p.title}
                      </Typography>
                      {phase === i && isRunning && (
                        <Chip
                          label="ACTIVE"
                          size="small"
                          sx={{
                            ml: 'auto',
                            bgcolor: `${p.color}22`,
                            color: p.color,
                            fontSize: '0.625rem',
                            height: 18,
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {p.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'rgba(15,23,42,0.6)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Algorithm Parameters
            </Typography>
            {[
              { label: 'Waypoints', value: waypoints.length },
              { label: 'Qubits Simulated', value: waypoints.length * 3 },
              { label: 'Total Steps', value: '5,000' },
              { label: 'Initial Temp', value: '100°' },
              { label: 'Cooling Rate', value: '0.995/step' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
              >
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {analysis && completed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'rgba(16,185,129,0.08)',
                  border: '1px solid',
                  borderColor: 'rgba(16,185,129,0.3)',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="overline"
                  color="secondary.main"
                  sx={{ mb: 1.5, display: 'block', fontWeight: 700 }}
                >
                  🎯 Solution Analysis
                </Typography>
                {[
                  {
                    label: 'Initial Route',
                    value: `${analysis.initialDistance.toFixed(2)} km`,
                    color: '#CCCCCC',
                  },
                  {
                    label: 'Final Route',
                    value: `${analysis.finalDistance.toFixed(2)} km`,
                    color: '#10B981',
                  },
                  {
                    label: 'Distance Improvement',
                    value: `${analysis.improvement.toFixed(2)} km (${analysis.improvementPercent.toFixed(1)}%)`,
                    color: analysis.improvement > 0 ? '#10B981' : '#EF4444',
                  },
                  {
                    label: 'CO₂ Saved',
                    value: `${analysis.co2Saved?.toFixed(2) || '0.00'} kg`,
                    color: '#10B981',
                  },
                  {
                    label: 'Energy Saved',
                    value: `${analysis.energySaved?.toFixed(2) || '0.00'} kWh`,
                    color: '#2563EB',
                  },
                  {
                    label: 'Execution Time',
                    value: `${analysis.executionTime.toFixed(2)}s`,
                    color: '#F59E0B',
                  },
                  {
                    label: 'Acceptance Rate',
                    value: `${analysis.acceptanceRate.toFixed(1)}%`,
                    color: '#F59E0B',
                  },
                  {
                    label: 'Energy Reduction',
                    value: `${((1 - analysis.finalEnergy / analysis.initialEnergy) * 100).toFixed(1)}%`,
                    color: '#8B5CF6',
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.75,
                      pb: 0.75,
                      borderBottom: '1px solid rgba(16,185,129,0.15)',
                      '&:last-child': { border: 'none', mb: 0 },
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: item.color }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}

                {analysis.aiAnalysis && (
                  <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <Typography
                      variant="overline"
                      color="secondary.main"
                      sx={{ mb: 1, display: 'block', fontWeight: 700 }}
                    >
                      🤖 AI Insights
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, display: 'block' }}
                    >
                      {analysis.aiAnalysis.analysis}
                    </Typography>
                    {analysis.aiAnalysis.recommendations.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{ color: '#8B5CF6', fontWeight: 700, display: 'block', mb: 0.5 }}
                        >
                          Recommendations:
                        </Typography>
                        {analysis.aiAnalysis.recommendations.slice(0, 2).map((rec, idx) => (
                          <Typography
                            key={idx}
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}
                          >
                            • {rec}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {analysis.aiAnalysis.estimatedSavings && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1.5 }}>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: '#2563EB', fontWeight: 700 }}
                          >
                            {analysis.aiAnalysis.estimatedSavings.time}m
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            Time Saved
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: '#10B981', fontWeight: 700 }}
                          >
                            {analysis.aiAnalysis.estimatedSavings.co2}kg
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            CO₂ Reduction
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
