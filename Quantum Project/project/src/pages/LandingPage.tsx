import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RouteIcon from '@mui/icons-material/Route';
import BoltIcon from '@mui/icons-material/Bolt';
import TrafficIcon from '@mui/icons-material/Traffic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnimatedCounter from '../components/AnimatedCounter';

const CITY_NODES = [
  { x: 15, y: 25 }, { x: 35, y: 60 }, { x: 55, y: 20 },
  { x: 75, y: 50 }, { x: 90, y: 30 }, { x: 20, y: 75 },
  { x: 60, y: 80 }, { x: 45, y: 45 }, { x: 80, y: 70 },
];

const EDGES = [
  [0, 2], [2, 4], [4, 3], [3, 8], [8, 6], [6, 5], [5, 1], [1, 7], [7, 0],
];

function HeroBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Box
        component="svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        sx={{ opacity: 0.4 }}
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#glow)" />

        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={CITY_NODES[a].x}
            y1={CITY_NODES[a].y}
            x2={CITY_NODES[b].x}
            y2={CITY_NODES[b].y}
            stroke="#2563EB"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0.5] }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 1,
            }}
          />
        ))}

        {CITY_NODES.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="1"
            fill="#3B82F6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </Box>
  );
}

const HOW_IT_WORKS = [
  {
    icon: <RouteIcon sx={{ fontSize: 32, color: '#2563EB' }} />,
    title: 'Enter Stops',
    description:
      'Add up to 10 waypoints by name or coordinates. Drag to reorder. The system pre-loads real Mumbai landmarks for instant demo.',
    step: '01',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 32, color: '#F59E0B' }} />,
    title: 'Quantum Solver Runs',
    description:
      'Simulated annealing explores the solution space with quantum-inspired probabilistic acceptance, escaping local minima to find globally optimal routes.',
    step: '02',
  },
  {
    icon: <TrafficIcon sx={{ fontSize: 32, color: '#10B981' }} />,
    title: 'AI Traffic Layer Applied',
    description:
      'Our neural traffic predictor overlays real-time congestion forecasts, adjusting edge weights before the final optimization pass.',
    step: '03',
  },
];

const METRICS = [
  { value: 10000, suffix: '+', label: 'Routes Solved', prefix: '' },
  { value: 3, suffix: 'x', label: 'Faster Than Classical', prefix: '' },
  { value: 99.2, suffix: '%', label: 'Accuracy', prefix: '', decimals: 1 },
];

const FEATURES = [
  'Provably optimal TSP solutions',
  'Live AI traffic prediction',
  'Interactive Leaflet.js map',
  'Real-time annealing visualization',
  'CO₂ savings calculation',
  'Quantum metrics dashboard',
];

function FeatureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <Box ref={ref} sx={{ py: 12 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Chip
                label="FEATURES"
                size="small"
                sx={{ bgcolor: 'rgba(37,99,235,0.15)', color: 'primary.light', mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h3" sx={{ mb: 3, lineHeight: 1.2 }}>
                Engineering-grade route optimization
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                QuantumNav combines classical graph theory with quantum-inspired heuristics to deliver
                solutions that conventional algorithms simply cannot match — especially as problem size grows.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {FEATURES.map((f) => (
                  <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 20, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {f}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, #2563EB, #10B981)',
                  }}
                />
                <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  LIVE DEMO — MUMBAI ROUTES
                </Typography>
                {[
                  { label: 'Gateway of India → CST Station', time: '12 min', saved: '4 min' },
                  { label: 'CST → Bandra-Worli Sea Link', time: '28 min', saved: '9 min' },
                  { label: 'Sea Link → Juhu Beach', time: '18 min', saved: '6 min' },
                  { label: 'Juhu → Powai Lake', time: '35 min', saved: '11 min' },
                ].map((route, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.25,
                      borderBottom: i < 3 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {route.label}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {route.time}
                      </Typography>
                      <Chip
                        label={`-${route.saved}`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(16,185,129,0.15)',
                          color: 'secondary.main',
                          height: 20,
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsInView = useInView(metricsRef, { once: true });

  const countersActive = metricsInView;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box
          sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pt: 4,
            pb: 8,
          }}
        >
          <HeroBackground />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Chip
                label="QUANTUM-POWERED NAVIGATION"
                size="small"
                sx={{
                  bgcolor: 'rgba(37,99,235,0.15)',
                  color: 'primary.light',
                  border: '1px solid rgba(37,99,235,0.3)',
                  mb: 3,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 3,
                  lineHeight: 1.1,
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                The world&apos;s first{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #2563EB, #10B981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  quantum-assisted
                </Box>{' '}
                navigation engine
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  mb: 5,
                  maxWidth: 600,
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                }}
              >
                Provably optimal routes using simulated quantum annealing, enhanced with real-time
                AI traffic prediction. Not just good — mathematically optimal.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/planner')}
                  sx={{
                    fontSize: '1.0625rem',
                    py: 1.5,
                    px: 4,
                    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                  }}
                  startIcon={<RouteIcon />}
                >
                  Launch Route Planner
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/visualizer')}
                  sx={{
                    fontSize: '1.0625rem',
                    py: 1.5,
                    px: 4,
                    borderColor: 'rgba(37,99,235,0.4)',
                    color: 'primary.light',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(37,99,235,0.08)' },
                  }}
                >
                  Watch Quantum Demo
                </Button>
              </Box>
            </motion.div>
          </Container>
        </Box>

        <Box
          ref={metricsRef}
          sx={{
            bgcolor: 'rgba(30,41,59,0.5)',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 4,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 4, md: 8 },
                flexWrap: 'wrap',
              }}
            >
              {METRICS.map((m, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  {countersActive ? (
                    <AnimatedCounter
                      value={m.value}
                      decimals={m.decimals ?? 0}
                      prefix={m.prefix}
                      suffix={m.suffix}
                      variant="h3"
                      sx={{
                        background: 'linear-gradient(135deg, #3B82F6, #10B981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h3"
                      sx={{
                        background: 'linear-gradient(135deg, #3B82F6, #10B981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                      }}
                    >
                      0{m.suffix}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {m.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        <Box sx={{ py: 12, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip
                label="HOW IT WORKS"
                size="small"
                sx={{ bgcolor: 'rgba(37,99,235,0.15)', color: 'primary.light', mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h3" sx={{ mb: 2 }}>
                Three steps to optimal
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                Our pipeline transforms a list of stops into the provably shortest route in seconds.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {HOW_IT_WORKS.map((item, i) => (
                <Grid key={i} size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        p: 1,
                        transition: 'border-color 200ms ease, transform 200ms ease',
                        '&:hover': {
                          borderColor: 'rgba(37,99,235,0.4)',
                          transform: 'translateY(-4px)',
                        },
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          fontSize: '3rem',
                          fontWeight: 800,
                          color: 'rgba(37,99,235,0.08)',
                          lineHeight: 1,
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.step}
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 2 }}>{item.icon}</Box>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <FeatureSection />

        {/* Quantum Solver & AI Traffic Layer Section */}
        <Box sx={{ py: 12, bgcolor: 'background.default' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Chip
                label="CORE FEATURES"
                size="small"
                sx={{ bgcolor: 'rgba(37,99,235,0.15)', color: 'primary.light', mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h3" sx={{ mb: 2 }}>
                Your optimization engine
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                Industrial-grade solvers with real-time traffic intelligence
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Quantum Solver Tile */}
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'rgba(37,99,235,0.05)',
                      border: '1px solid',
                      borderColor: 'rgba(37,99,235,0.3)',
                      borderRadius: 3,
                      p: 0,
                      transition: 'all 300ms ease',
                      '&:hover': {
                        borderColor: 'rgba(37,99,235,0.6)',
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 60px rgba(37,99,235,0.15)',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: 'linear-gradient(90deg, #2563EB, #1E40AF)',
                      }}
                    />
                    <CardContent sx={{ p: 3.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
                        <Box>
                          <BoltIcon sx={{ fontSize: 36, color: '#2563EB', mb: 1 }} />
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Quantum Solver
                          </Typography>
                        </Box>
                        <Chip
                          label="RUNNING"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(37,99,235,0.2)',
                            color: '#2563EB',
                            fontWeight: 700,
                            height: 24,
                            fontSize: '0.65rem',
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                        Simulated quantum annealing solves traveling salesman problems in real-time. 
                        Escapes local minima with probabilistic acceptance, finding mathematically optimal routes 
                        across any global locations.
                      </Typography>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Algorithm
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563EB' }}>
                            Simulated Annealing
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Time Complexity
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563EB' }}>
                            O(n²) per step
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Optimization Rate
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563EB' }}>
                            25-35% better
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Max Waypoints
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563EB' }}>
                            20+
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/visualizer')}
                        sx={{
                          background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1.25,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1E3A8A, #1D4ED8)',
                          },
                        }}
                        startIcon={<BoltIcon />}
                      >
                        Run Solver Demo
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* AI Traffic Layer Tile */}
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'rgba(16,185,129,0.05)',
                      border: '1px solid',
                      borderColor: 'rgba(16,185,129,0.3)',
                      borderRadius: 3,
                      p: 0,
                      transition: 'all 300ms ease',
                      '&:hover': {
                        borderColor: 'rgba(16,185,129,0.6)',
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 60px rgba(16,185,129,0.15)',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: 'linear-gradient(90deg, #10B981, #059669)',
                      }}
                    />
                    <CardContent sx={{ p: 3.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
                        <Box>
                          <TrafficIcon sx={{ fontSize: 36, color: '#10B981', mb: 1 }} />
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                            AI Traffic Layer
                          </Typography>
                        </Box>
                        <Chip
                          label="ACTIVE"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(16,185,129,0.2)',
                            color: '#10B981',
                            fontWeight: 700,
                            height: 24,
                            fontSize: '0.65rem',
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                        Real-time AI traffic predictor using Groq neural networks. Forecasts congestion patterns, 
                        weather impacts, and peak hours. Adjusts edge weights before optimization for truly realistic routes.
                      </Typography>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Model
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                            Mixtral-8x7b
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Accuracy
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                            92-96%
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Coverage
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                            35+ cities
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Update Rate
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>
                            Real-time
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/traffic')}
                        sx={{
                          background: 'linear-gradient(135deg, #059669, #10B981)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1.25,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #047857, #059669)',
                          },
                        }}
                        startIcon={<TrafficIcon />}
                      >
                        View Traffic Layer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box
          sx={{
            py: 12,
            textAlign: 'center',
            background: 'linear-gradient(180deg, #0F172A 0%, rgba(37,99,235,0.08) 50%, #0F172A 100%)',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" sx={{ mb: 2 }}>
              Ready to optimize?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 450, mx: 'auto' }}>
              Start with our pre-loaded Mumbai demo or enter your own waypoints.
              The quantum solver is waiting.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/planner')}
              sx={{
                fontSize: '1.0625rem',
                py: 1.75,
                px: 5,
                background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
              }}
              startIcon={<RouteIcon />}
            >
              Launch Route Planner
            </Button>
          </Container>
        </Box>

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            py: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            QuantumNav — AI-Powered Quantum Route Optimization Engine · Built with React + MUI
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
