import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
    divider: '#334155',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { fontWeight: 400 },
    overline: { fontWeight: 600, letterSpacing: '0.1em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        'html, body': { margin: 0, padding: 0, scrollBehavior: 'smooth' },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: '#0F172A' },
        '::-webkit-scrollbar-thumb': { background: '#334155', borderRadius: '3px' },
        '::-webkit-scrollbar-thumb:hover': { background: '#475569' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          transition: 'all 200ms ease',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.4)',
          '&:hover': { boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.5)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid #1E3A5F' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              '& + .MuiSwitch-track': {
                backgroundColor: '#2563EB',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': { boxSizing: 'border-box', width: 22, height: 22 },
          '& .MuiSwitch-track': { borderRadius: 13, backgroundColor: '#334155', opacity: 1 },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: '#1E3A5F' },
        bar: { borderRadius: 4 },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: '#2563EB' },
        track: { border: 'none' },
        thumb: {
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&:hover': { boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)' },
        },
      },
    },
  },
});

export default theme;
