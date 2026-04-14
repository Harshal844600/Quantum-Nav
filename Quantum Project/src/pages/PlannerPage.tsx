import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RouteIcon from '@mui/icons-material/Route';
import BoltIcon from '@mui/icons-material/Bolt';
import DirectionsIcon from '@mui/icons-material/Directions';
import Co2Icon from '@mui/icons-material/Co2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TurnSlightRightIcon from '@mui/icons-material/TurnSlightRight';
import RoomIcon from '@mui/icons-material/Room';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../store/useStore';
import { solveQuantum, solveClassic } from '../lib/quantumSolver';
import { generateTrafficData } from '../lib/trafficAI';
import { haversineDistance } from '../lib/utils';
import { calculateConservation, type ConservationResult, VEHICLE_PROFILES } from '../lib/energyConservation';
import WaypointInput from '../components/WaypointInput';
import ModeToggle from '../components/ModeToggle';
import EnergyChart from '../components/EnergyChart';
import RouteGraphVisualization from '../components/RouteGraphVisualization';
import type { Waypoint } from '../lib/quantumSolver';
import type { Place } from '../lib/places';
import { GLOBAL_PLACES } from '../lib/places';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PIN_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#2563EB', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

function createNumberedIcon(number: number, color: string) {
  return L.divIcon({
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      font-family: Inter, Roboto, sans-serif;
    ">${number}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapFitter({ waypoints }: { waypoints: Waypoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints.length > 0) {
      // Filter out waypoints with invalid coordinates
      const validWaypoints = waypoints.filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number');
      if (validWaypoints.length > 0) {
        const bounds = L.latLngBounds(validWaypoints.map((w) => [w.lat, w.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [waypoints, map]);
  return null;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'City': '#3B82F6',
    'Landmark': '#F59E0B',
    'Capital': '#10B981',
    'Business': '#8B5CF6',
  };
  return colors[category] || '#3B82F6';
}

export default function PlannerPage() {
  const {
    waypoints, setWaypoints, addWaypoint, removeWaypoint,
    optimizationMode, setOptimizationMode,
    trafficEnabled, setTrafficEnabled,
    isSolving, setIsSolving,
    solverResult, setSolverResult,
    trafficData, setTrafficData,
    solverProgress, setSolverProgress,
    addToRouteHistory,
  } = useStore();

  const [metricsOpen, setMetricsOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [previewPlace, setPreviewPlace] = useState<Place | null>(null);
  const [conservation, setConservation] = useState<ConservationResult | null>(null);
  const [vehicleType, setVehicleType] = useState('cng_car');
  const progressRef = useRef(0);

  // Calculate CO2 saved based on actual vehicle profile
  const calculateCO2Saved = useCallback((totalDistance: number, vehicleType: string): string => {
    const vehicle = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.cng_car;
    const fuelConsumed = totalDistance * vehicle.fuelConsumption;
    const co2Emitted = fuelConsumed * vehicle.co2EmissionFactor;
    return co2Emitted.toFixed(2);
  }, []);

  const calculateBearing = useCallback((from: Waypoint, to: Waypoint): string => {
    // Safety check for waypoint coordinates
    if (!from || !to || typeof from.lat !== 'number' || typeof from.lng !== 'number' || typeof to.lat !== 'number' || typeof to.lng !== 'number') {
      return 'N/A';
    }
    
    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const dLon = ((to.lng - from.lng) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * (180 / Math.PI);
    const normalizedBearing = (bearing + 360) % 360;

    if (normalizedBearing < 22.5 || normalizedBearing >= 337.5) return 'North';
    if (normalizedBearing < 67.5) return 'Northeast';
    if (normalizedBearing < 112.5) return 'East';
    if (normalizedBearing < 157.5) return 'Southeast';
    if (normalizedBearing < 202.5) return 'South';
    if (normalizedBearing < 247.5) return 'Southwest';
    if (normalizedBearing < 292.5) return 'West';
    return 'Northwest';
  }, []);

  const calculateDistance = useCallback((from: Waypoint, to: Waypoint): number => {
    if (!from || !to || typeof from.lat !== 'number' || typeof from.lng !== 'number' || typeof to.lat !== 'number' || typeof to.lng !== 'number') {
      return 0;
    }
    const dx = from.lat - to.lat;
    const dy = from.lng - to.lng;
    return Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
  }, []);

  const generateNavigationSteps = () => {
    const waypoints = solverResult ? solverResult.tourWaypoints : [];
    if (waypoints.length < 2) return [];

    const steps = [];
    for (let i = 0; i < waypoints.length; i++) {
      const current = waypoints[i];
      const next = waypoints[(i + 1) % waypoints.length];
      
      // Skip if waypoints have invalid coordinates
      if (!current || !next || typeof current.lat !== 'number' || typeof current.lng !== 'number') {
        continue;
      }
      
      const distance = calculateDistance(current, next);
      const direction = calculateBearing(current, next);

      steps.push({
        number: i + 1,
        from: current.label,
        to: next.label,
        distance: distance.toFixed(2),
        direction,
        lat: current.lat,
        lng: current.lng,
      });
    }
    return steps;
  };

  const handleReorder = useCallback(
    (newWaypoints: Waypoint[]) => setWaypoints(newWaypoints),
    [setWaypoints]
  );

  const handleSolve = useCallback(async () => {
    if (waypoints.length < 2) return;
    setIsSolving(true);
    setSolverProgress(0);
    setMetricsOpen(false);

    await new Promise((resolve) => setTimeout(resolve, 50));

    let trafficWeights: number[][] | undefined;
    if (trafficEnabled) {
      const traffic = await generateTrafficData(waypoints, new Date().getHours());
      setTrafficData(traffic);
      trafficWeights = traffic.weightMatrix;
    }

    let result;
    if (optimizationMode === 'quantum') {
      progressRef.current = 0;
      result = await new Promise<ReturnType<typeof solveQuantum>>((resolve) => {
        setTimeout(() => {
          const r = solveQuantum(waypoints, trafficWeights, (p) => {
            progressRef.current = (p.step / 5000) * 100;
            setSolverProgress(progressRef.current);
          });
          resolve(r);
        }, 10);
      });
    } else {
      result = solveClassic(waypoints);
    }

    setSolverResult(result);
    
    // Calculate energy conservation metrics with selected vehicle
    if (result) {
      // Calculate initial unoptimized distance (sum of sequential waypoints)
      let initialDistance = 0;
      for (let i = 0; i < waypoints.length; i++) {
        const from = waypoints[i];
        const to = waypoints[(i + 1) % waypoints.length];
        // Skip if coordinates are missing
        if (!from || !to || typeof from.lat !== 'number' || typeof from.lng !== 'number' || typeof to.lat !== 'number' || typeof to.lng !== 'number') {
          continue;
        }
        initialDistance += haversineDistance(from.lat, from.lng, to.lat, to.lng);
      }
      
      // Calculate energy conservation metrics with selected vehicle
      const conservationResult = calculateConservation(initialDistance, result.totalDistance, vehicleType);
      setConservation(conservationResult);
    }
    
    addToRouteHistory(result.tourWaypoints, result.totalDistance);
    setSolverProgress(100);
    setIsSolving(false);
    setMetricsOpen(true);
  }, [waypoints, optimizationMode, trafficEnabled, vehicleType, setIsSolving, setSolverProgress, setSolverResult, setTrafficData, addToRouteHistory]);

  const routeCoords: [number, number][] = useMemo(() => solverResult
    ? [...solverResult.tourWaypoints, solverResult.tourWaypoints[0]]
        .filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number')
        .map((w) => [w.lat, w.lng])
    : waypoints
        .filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number')
        .map((w) => [w.lat, w.lng]), [solverResult, waypoints]);

  const validWaypoints = useMemo(() => waypoints.filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number'), [waypoints]);
  const center: [number, number] = useMemo(() =>
    validWaypoints.length > 0
      ? [
          validWaypoints.reduce((s, w) => s + w.lat, 0) / validWaypoints.length,
          validWaypoints.reduce((s, w) => s + w.lng, 0) / validWaypoints.length,
        ]
      : [19.076, 72.877], [validWaypoints]);

  const co2Saved = solverResult
    ? calculateCO2Saved(solverResult.totalDistance, vehicleType)
    : '—';
  const estTime = solverResult
    ? Math.round((solverResult.totalDistance / (VEHICLE_PROFILES[vehicleType]?.avgSpeed || 25)) * 60).toString()
    : '—';

  const displayWaypoints = useMemo(() => {
    const wp = solverResult ? solverResult.tourWaypoints : waypoints;
    return wp ? wp.filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number') : [];
  }, [solverResult, waypoints]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden' }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: 400 },
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Route Planner
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Add stops and choose optimization mode
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Waypoints
            </Typography>
            <WaypointInput
              waypoints={waypoints}
              onAdd={addWaypoint}
              onRemove={removeWaypoint}
              onReorder={handleReorder}
              onPreview={setPreviewPlace}
            />
          </Box>

          {/* Location Accuracy Info */}
          {waypoints.length > 0 && (
            <Card sx={{ bgcolor: 'rgba(139, 92, 246, 0.08)', border: '1px solid', borderColor: 'rgba(139, 92, 246, 0.2)', mb: 2.5, p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  LOCATION COVERAGE
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {waypoints.map((wp, idx) => (
                  <Chip
                    key={wp.id}
                    label={`${idx + 1}. ${(wp.label ?? 'Unknown').split(',')[0].substring(0, 12)}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      color: '#fff',
                      bgcolor:
                        Math.abs(wp.lat) <= 89 && Math.abs(wp.lng) <= 179
                          ? '#10B981'
                          : '#EF4444',
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {waypoints.length} location{waypoints.length !== 1 ? 's' : ''} • Global coverage
              </Typography>
            </Card>
          )}

          <Divider sx={{ my: 2.5, borderColor: 'divider' }} />

          <Box sx={{ mb: 2.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Optimization Mode
            </Typography>
            <ModeToggle value={optimizationMode} onChange={setOptimizationMode} />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Traffic Prediction
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'rgba(15,23,42,0.5)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Live AI Prediction
                </Typography>
                <Typography variant="caption" color={trafficEnabled ? 'secondary.main' : 'text.disabled'}>
                  {trafficEnabled ? 'Active — adjusting edge weights' : 'Disabled'}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={trafficEnabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTrafficEnabled(e.target.checked)}
                    size="small"
                  />
                }
                label=""
                sx={{ mr: 0 }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
              Vehicle Type
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {Object.entries(VEHICLE_PROFILES).map(([key, profile]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVehicleType(key)}
                  style={{
                    border: vehicleType === key ? '2px solid #2563EB' : '1px solid rgba(100,116,139,0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    background: vehicleType === key ? 'rgba(37,99,235,0.1)' : 'rgba(15,23,42,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: vehicleType === key ? '#2563EB' : 'white', display: 'block', mb: 0.25 }}>
                      {profile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      {profile.fuelType} • {profile.fuelConsumption.toFixed(2)} L/km
                    </Typography>
                  </Box>
                </motion.button>
              ))}
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSolve}
            disabled={isSolving || waypoints.length < 2}
            sx={{
              py: 1.5,
              mb: 2,
              background: isSolving
                ? 'rgba(37,99,235,0.4)'
                : 'linear-gradient(135deg, #1D4ED8, #2563EB)',
              fontSize: '0.9375rem',
              position: 'relative',
              overflow: 'hidden',
            }}
            startIcon={
              isSolving ? (
                <CircularProgress size={18} sx={{ color: 'white' }} />
              ) : (
                <BoltIcon />
              )
            }
          >
            {isSolving ? 'Quantum annealing in progress...' : 'Solve Route'}
          </Button>

          {isSolving && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Annealing...
                </Typography>
                <Typography variant="caption" color="primary.light">
                  {Math.round(solverProgress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={solverProgress}
                sx={{ height: 6 }}
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mt: 1,
                  flexWrap: 'wrap',
                }}
              >
                {['Initializing qubits', 'Cooling...', 'Converging'].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.5,
                      repeat: Infinity,
                    }}
                  >
                    <Chip
                      label={label}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(37,99,235,0.1)',
                        color: 'primary.light',
                        fontSize: '0.6875rem',
                        height: 20,
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}

          {solverResult && (
            <Card
              sx={{
                bgcolor: 'rgba(15,23,42,0.7)',
                border: '1px solid',
                borderColor: 'rgba(37,99,235,0.3)',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.25,
                  cursor: 'pointer',
                }}
                onClick={() => setMetricsOpen(!metricsOpen)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BoltIcon sx={{ color: 'primary.light', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Quantum Metrics
                  </Typography>
                </Box>
                <IconButton size="small">
                  {metricsOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Box>
              <Collapse in={metricsOpen}>
                <Divider sx={{ borderColor: 'divider' }} />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
                    {[
                      { label: 'Qubits Simulated', value: solverResult?.qubitsSimulated ?? 0, color: '#2563EB' },
                      { label: 'Annealing Steps', value: (solverResult?.annealingSteps ?? 0).toLocaleString(), color: '#F59E0B' },
                      { label: 'Optimization', value: `${(solverResult?.actualOptimizationPercent ?? 0).toFixed(1)}%`, color: '#10B981' },
                      { label: 'Confidence', value: `${(solverResult?.confidenceLevel ?? 0).toFixed(0)}%`, color: '#8B5CF6' },
                    ].map((m) => (
                      <Box
                        key={m.label}
                        sx={{
                          bgcolor: 'rgba(15,23,42,0.5)',
                          borderRadius: 1.5,
                          p: 1.25,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                          {m.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: m.color }}>
                          {m.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Performance Metrics */}
                  {solverResult && (
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(16,185,129,0.08)', borderRadius: 1.5, border: '1px solid rgba(16,185,129,0.15)' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 700 }}>
                        🎯 PERFORMANCE
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                            Distance Saved
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#10B981' }}>
                            {((solverResult.initialDistance ?? 0) - (solverResult.totalDistance ?? 0)).toFixed(1)} km
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                            Time Saved
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                            {solverResult.timeVsClassical ?? 0} min
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                            Effective Steps
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                            {(solverResult.effectiveSteps ?? 0)} / {(solverResult.annealingSteps ?? 0).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                            Route Status
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: ((solverResult.actualOptimizationPercent ?? 0) > 15 ? '#10B981' : '#F59E0B') }}>
                            {((solverResult.actualOptimizationPercent ?? 0) > 15 ? '✓ Optimal' : '○ Good')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {solverResult?.energyHistory && solverResult.energyHistory.length > 0 && (
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Convergence (Energy over {(solverResult.annealingSteps ?? 0).toLocaleString()} steps)
                      </Typography>
                      <EnergyChart data={solverResult.energyHistory} height={140} />
                    </>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          )}

          {solverResult && conservation && (
            <Card
              sx={{
                bgcolor: 'rgba(16,185,129,0.08)',
                border: '1px solid',
                borderColor: 'rgba(16,185,129,0.3)',
                borderRadius: 2,
                mt: 2,
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Co2Icon sx={{ color: '#10B981', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#10B981' }}>
                      {VEHICLE_PROFILES[vehicleType]?.name || 'Vehicle'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Energy & Emissions Savings
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                  {[
                    { label: 'Distance', value: `${conservation.savings.distance.toFixed(1)} km`, color: '#3B82F6', icon: '📍' },
                    { label: 'CO₂ Saved', value: `${conservation.savings.co2.toFixed(1)} kg`, color: '#10B981', icon: '🌱' },
                    { label: 'Fuel Saved', value: `${conservation.savings.fuel.toFixed(2)} L`, color: '#F59E0B', icon: '⛽' },
                    { label: 'Cost Saved', value: `₹${conservation.savings.cost.toFixed(0)}`, color: '#8B5CF6', icon: '💰' },
                  ].map((m) => (
                    <Box
                      key={m.label}
                      sx={{
                        bgcolor: 'rgba(15,23,42,0.5)',
                        borderRadius: 1.5,
                        p: 1.25,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography variant="caption" color="text.secondary">
                          {m.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: m.color, mt: 0.25 }}>
                        {m.icon} {m.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 1, borderColor: 'divider' }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                      Trees Offset
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>
                      {conservation.savings.trees.toFixed(0)} 🌳
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                      Improvement
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                      {conservation.improvementPercent.fuel.toFixed(1)}% fuel ↓
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          )}

          {/* Route Graph Visualization */}
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontWeight: 700 }}>
              📊 Route Comparison
            </Typography>
            <RouteGraphVisualization
              waypoints={waypoints}
              solverResult={solverResult}
              isSolving={isSolving}
            />
          </Box>

          {solverResult && (
            <Card
              sx={{
                bgcolor: 'rgba(15,23,42,0.7)',
                border: '1px solid',
                borderColor: 'rgba(16,185,129,0.3)',
                borderRadius: 2,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.25,
                  cursor: 'pointer',
                }}
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NavigateNextIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Turn-by-Turn Navigation
                  </Typography>
                </Box>
                <IconButton size="small">
                  {navigationOpen ? (
                    <ExpandLessIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Box>
              <Collapse in={navigationOpen}>
                <Divider sx={{ borderColor: 'divider' }} />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, maxHeight: 400, overflowY: 'auto' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {generateNavigationSteps().map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            p: 1.25,
                            bgcolor: 'rgba(15,23,42,0.5)',
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 200ms ease',
                            '&:hover': {
                              borderColor: 'secondary.main',
                              bgcolor: 'rgba(16,185,129,0.05)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'rgba(16,185,129,0.2)',
                              color: 'secondary.main',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              flexShrink: 0,
                            }}
                          >
                            {step.number}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                              <RoomIcon sx={{ fontSize: 14, color: 'primary.light' }} />
                              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {step.from}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <TurnSlightRightIcon
                                sx={{
                                  fontSize: 14,
                                  color: 'secondary.main',
                                  transform: 'rotate(-45deg)',
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Head {step.direction} toward {step.to}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                pt: 0.5,
                                borderTop: '1px solid rgba(15,23,42,0.3)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <DirectionsIcon sx={{ fontSize: 12, color: 'primary.light' }} />
                                <Typography variant="caption" color="primary.light" sx={{ fontWeight: 700 }}>
                                  {step.distance} km
                                </Typography>
                              </Box>
                              {idx < generateNavigationSteps().length - 1 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AccessTimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    ~{Math.round(parseFloat(step.distance) * 3)} min
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          )}
        </Box>
      </Box>

      <Box sx={{ flex: 1, position: 'relative', display: { xs: 'none', md: 'block' } }}>
        <MapContainer
          center={center}
          zoom={11}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFitter waypoints={waypoints} />

          {/* Global Places Visualization - Smallest to Famous */}
          {GLOBAL_PLACES.filter(place => place && typeof place.lat === 'number' && typeof place.lng === 'number').map((place) => (
            <Circle
              key={place.id}
              center={[place.lat, place.lng]}
              radius={Math.max(500, Math.min(5000, (place.importance || 50) * 50))} // 500m to 5km based on importance
              pathOptions={{
                fillColor: getCategoryColor(place.category || 'City'),
                fillOpacity: 0.4,
                color: getCategoryColor(place.category || 'City'),
                weight: 2,
                opacity: 0.7,
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 160 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {place.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {place.city}, {place.country}
                  </Typography>
                  {place.population && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      <strong>Population:</strong> {(place.population / 1000000).toFixed(1)}M
                    </Typography>
                  )}
                  {place.importance && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.3, color: '#F59E0B' }}>
                      <strong>Importance:</strong> {place.importance}/100
                    </Typography>
                  )}
                  <Chip
                    label={place.category}
                    size="small"
                    sx={{ mt: 1, bgcolor: getCategoryColor(place.category || 'City'), color: 'white' }}
                  />
                </Box>
              </Popup>
            </Circle>
          ))}

          {displayWaypoints.map((wp, i) => {
            if (!wp || typeof wp.lat !== 'number' || typeof wp.lng !== 'number') return null;
            return (
              <Marker
                key={wp.id}
                position={[wp.lat, wp.lng]}
                icon={createNumberedIcon(i + 1, PIN_COLORS[i % PIN_COLORS.length])}
              >
                <Popup>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {i + 1}. {wp.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {wp?.lat?.toFixed(4)}, {wp?.lng?.toFixed(4)}
                    </Typography>
                    {trafficData && trafficData.segments && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#F59E0B' }}>
                        Traffic: {trafficData.segments.find(s => s.from === waypoints.indexOf(wp))?.label ?? 'Free'}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Marker>
            );
          })}

          {/* Preview marker for autocomplete suggestion */}
          {previewPlace && typeof previewPlace.lat === 'number' && typeof previewPlace.lng === 'number' && (
            <Marker
              position={[previewPlace.lat, previewPlace.lng]}
              icon={L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })}
              eventHandlers={{
                add: (e) => {
                  const el = e.target.getElement();
                  if (el) {
                    (el as HTMLElement).style.opacity = '0.6';
                  }
                }
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 140 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#8B5CF6' }}>
                    {previewPlace.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {previewPlace?.lat?.toFixed(4)}, {previewPlace?.lng?.toFixed(4)}
                  </Typography>
                  {previewPlace.category && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#2563EB' }}>
                      {previewPlace.category}
                    </Typography>
                  )}
                </Box>
              </Popup>
            </Marker>
          )}

          {routeCoords.length > 1 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: solverResult ? '#2563EB' : '#475569',
                weight: solverResult ? 4 : 2,
                opacity: solverResult ? 0.9 : 0.4,
                dashArray: solverResult ? undefined : '8 8',
              }}
            />
          )}
        </MapContainer>

        {solverResult && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              bgcolor: 'rgba(15,23,42,0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid',
              borderColor: 'rgba(37,99,235,0.3)',
              borderRadius: 2.5,
              p: 2.5,
              minWidth: 240,
              zIndex: 1000,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <RouteIcon sx={{ color: 'primary.light', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Route Summary
              </Typography>
              <Chip
                label={optimizationMode === 'quantum' ? 'QUANTUM' : 'CLASSIC'}
                size="small"
                sx={{
                  ml: 'auto',
                  bgcolor: optimizationMode === 'quantum' ? 'rgba(37,99,235,0.2)' : 'rgba(71,85,105,0.3)',
                  color: optimizationMode === 'quantum' ? 'primary.light' : 'text.secondary',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  height: 18,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <DirectionsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">Total Distance</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.light' }}>
                  {solverResult.totalDistance.toFixed(1)} km
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">Est. Time</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  ~{estTime} min
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Co2Icon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">CO₂ Saved</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {co2Saved} kg
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {isSolving && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(15,23,42,0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BoltIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              </motion.div>
              <Typography variant="h6" color="primary.light">
                Quantum annealing in progress...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Simulating {waypoints.length * 3} qubits
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
