import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { generateTrafficData, getTopCongestedCorridors } from '../lib/trafficAI';
import type { TrafficData, CongestionLabel } from '../lib/trafficAI';
import type { Waypoint } from '../lib/quantumSolver';
import { useStore } from '../store/useStore';

const CONGESTION_COLORS: Record<CongestionLabel, string> = {
  Free: '#10B981',
  Moderate: '#F59E0B',
  Heavy: '#EF4444',
  Gridlock: '#991B1B',
};

function formatHour(h: number): string {
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:00 ${period}`;
}

function ConfidenceGauge({ value }: { value: number }) {
  const data = [{ name: 'confidence', value, fill: '#2563EB' }];
  return (
    <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          data={data}
          startAngle={220}
          endAngle={-40}
        >
          <RadialBar
            dataKey="value"
            background={{ fill: '#1E3A5F' }}
            cornerRadius={8}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.light', lineHeight: 1 }}>
          {value.toFixed(1)}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          AI Confidence
        </Typography>
      </Box>
    </Box>
  );
}

export default function TrafficPage() {
  const { waypoints } = useStore();
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [hour, setHour] = useState(() => new Date().getHours());
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);

  const activeWaypoints: Waypoint[] = useMemo(() => 
    waypoints.length >= 3 ? waypoints : [
      { id: '1', lat: 18.922, lng: 72.8347, label: 'Gateway of India' },
      { id: '2', lat: 19.033, lng: 72.8197, label: 'Sea Link' },
      { id: '3', lat: 18.9398, lng: 72.8354, label: 'CST Station' },
      { id: '4', lat: 19.0988, lng: 72.8264, label: 'Juhu Beach' },
      { id: '5', lat: 19.1073, lng: 72.9087, label: 'Powai Lake' },
    ],
    [waypoints]
  );

  // Auto-update current hour every minute
  useEffect(() => {
    const updateCurrentHour = () => {
      setCurrentHour(new Date().getHours());
    };
    
    // Initialize with current hour
    updateCurrentHour();
    
    // Update every minute
    const interval = setInterval(updateCurrentHour, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadTrafficData = async () => {
      const data = await generateTrafficData(activeWaypoints, hour);
      setTrafficData(data);
    };
    loadTrafficData();
  }, [hour, activeWaypoints]);

  const corridors = trafficData
    ? getTopCongestedCorridors(trafficData.segments, activeWaypoints, 5)
    : [];

  const validWaypoints = useMemo(() => activeWaypoints.filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number'), [activeWaypoints]);
  const center: [number, number] = useMemo(() => validWaypoints.length > 0 ? [
    validWaypoints.reduce((s, w) => s + w.lat, 0) / validWaypoints.length,
    validWaypoints.reduce((s, w) => s + w.lng, 0) / validWaypoints.length,
  ] : [19.0760, 72.8777], [validWaypoints]); // Mumbai fallback center

  const isPeak = hour === 8 || hour === 9 || hour === 17 || hour === 18;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', pb: 8 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 3,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    AI Traffic Dashboard
                  </Typography>
                  {isPeak && (
                    <Chip
                      label="PEAK HOUR"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(239,68,68,0.15)',
                        color: 'error.light',
                        fontWeight: 700,
                        border: '1px solid rgba(239,68,68,0.3)',
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Predictive congestion heatmap powered by AI · {activeWaypoints.length} zones monitored
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 320 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Time of Day
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="primary.light" sx={{ fontWeight: 600 }}>
                        {formatHour(hour)}
                      </Typography>
                      {hour !== currentHour && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          (Now: {formatHour(currentHour)})
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Slider
                    value={hour}
                    onChange={(_: Event, v: number | number[]) => setHour(v as number)}
                    min={0}
                    max={23}
                    step={1}
                    marks={[
                      { value: 0, label: '12AM' },
                      { value: 6, label: '6AM' },
                      { value: 12, label: '12PM' },
                      { value: 18, label: '6PM' },
                      { value: 23, label: '11PM' },
                    ]}
                    sx={{
                      '& .MuiSlider-markLabel': { fontSize: '0.625rem', color: '#64748B' },
                    }}
                  />
                </Box>
                <Button
                  variant={hour === currentHour ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={<AccessTimeIcon />}
                  onClick={() => setHour(currentHour)}
                  sx={{
                    mt: 2.5,
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Now
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box
                sx={{
                  height: 480,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 1000,
                    bgcolor: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  {(['Free', 'Moderate', 'Heavy', 'Gridlock'] as CongestionLabel[]).map((l) => (
                    <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: CONGESTION_COLORS[l] }} />
                      <Typography variant="caption" sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
                        {l}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <MapContainer
                  center={center}
                  zoom={11}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {trafficData?.heatmap.map((point, i) => {
                    if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') return null;
                    const intensity = Math.max(0.2, point.intensity);
                    const color =
                      intensity < 0.25 ? CONGESTION_COLORS.Free
                        : intensity < 0.5 ? CONGESTION_COLORS.Moderate
                          : intensity < 0.75 ? CONGESTION_COLORS.Heavy
                            : CONGESTION_COLORS.Gridlock;
                    return (
                      <Circle
                        key={i}
                        center={[point.lat, point.lng]}
                        radius={700}
                        pathOptions={{
                          color: 'none',
                          fillColor: color,
                          fillOpacity: Math.min(0.65, 0.2 + intensity * 0.55),
                          weight: 0,
                        }}
                      />
                    );
                  })}
                  {activeWaypoints.filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number').map((wp, i) => (
                    <Circle
                      key={wp.id}
                      center={[wp.lat, wp.lng]}
                      radius={800}
                      pathOptions={{
                        color: '#2563EB',
                        fillColor: '#2563EB',
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    >
                      <Tooltip permanent direction="top">
                        <Box component="span" sx={{ fontWeight: 600, fontSize: '11px' }}>
                          {i + 1}. {wp.label}
                        </Box>
                      </Tooltip>
                    </Circle>
                  ))}
                </MapContainer>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="overline" color="text.secondary">
                        AI Confidence Score
                      </Typography>
                      {trafficData?.aiEnhanced && (
                        <Chip
                          label="🤖 AI Enhanced"
                          size="small"
                          sx={{
                            height: 'auto',
                            py: 0.25,
                            backgroundColor: 'rgba(139, 92, 246, 0.15)',
                            color: '#8B5CF6',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>
                    {trafficData && <ConfidenceGauge value={trafficData.confidence} />}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}
                    >
                      {trafficData?.aiEnhanced ? 'Using real-time AI predictions' : 'Based on 14-day rolling average traffic patterns'}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      Overall Status
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      {(['Free', 'Moderate', 'Heavy', 'Gridlock'] as CongestionLabel[]).map((label) => {
                        const count = trafficData?.segments.filter((s) => s.label === label).length ?? 0;
                        const total = trafficData?.segments.length ?? 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <Box
                            key={label}
                            sx={{
                              bgcolor: 'rgba(15,23,42,0.5)',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1.5,
                              p: 1.25,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: CONGESTION_COLORS[label] }} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                                {label}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: CONGESTION_COLORS[label] }}>
                              {pct}%
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Top 5 Congested Corridors — {formatHour(hour)}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', border: 'none' }}>
                            #
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', border: 'none' }}>
                            From
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', border: 'none' }}>
                            To
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', border: 'none' }}>
                            Status
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', border: 'none' }}>
                            Delay
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', border: 'none' }}>
                            Score
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {corridors.map((c, i) => (
                          <TableRow
                            key={i}
                            sx={{
                              '& td': { borderColor: 'divider', py: 1.25 },
                              '&:last-child td': { border: 'none' },
                              '&:hover': { bgcolor: 'rgba(37,99,235,0.04)' },
                            }}
                          >
                            <TableCell>
                              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                                {i + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                                {c.from}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                                {c.to}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={c.label}
                                size="small"
                                sx={{
                                  bgcolor: CONGESTION_COLORS[c.label] + '22',
                                  color: CONGESTION_COLORS[c.label],
                                  fontWeight: 700,
                                  height: 22,
                                  fontSize: '0.6875rem',
                                  border: `1px solid ${CONGESTION_COLORS[c.label]}44`,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: c.delay > 10 ? 'error.light' : c.delay > 5 ? 'warning.main' : 'secondary.main',
                                  fontSize: '0.8125rem',
                                }}
                              >
                                +{c.delay} min
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.75,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 5,
                                    bgcolor: 'rgba(15,23,42,0.8)',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: '100%',
                                      width: `${c.score}%`,
                                      bgcolor: CONGESTION_COLORS[c.label],
                                      borderRadius: 1,
                                    }}
                                  />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {c.score}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </motion.div>
  );
}
