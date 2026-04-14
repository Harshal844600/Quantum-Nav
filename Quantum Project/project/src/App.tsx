import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import theme from './theme';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PlannerPage from './pages/PlannerPage';
import VisualizerPage from './pages/VisualizerPage';
import TrafficPage from './pages/TrafficPage';
import { useAppInit } from './hooks/useAppInit';

function AppContent() {
  // Initialize app on startup
  useAppInit();

  return (
    <BrowserRouter>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/traffic" element={<TrafficPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
