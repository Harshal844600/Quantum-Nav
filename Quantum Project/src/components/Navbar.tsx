import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Planner', path: '/planner' },
  { label: 'Visualizer', path: '/visualizer' },
  { label: 'Traffic AI', path: '/traffic' },
];

function QuantumIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="3" fill="#2563EB" />
      <circle cx="4" cy="8" r="2" fill="#3B82F6" />
      <circle cx="24" cy="8" r="2" fill="#3B82F6" />
      <circle cx="4" cy="20" r="2" fill="#3B82F6" />
      <circle cx="24" cy="20" r="2" fill="#3B82F6" />
      <line x1="6" y1="8" x2="12" y2="13" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="22" y1="8" x2="16" y2="13" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="6" y1="20" x2="12" y2="15" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="22" y1="20" x2="16" y2="15" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="14" cy="14" r="8" stroke="#2563EB" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      <circle cx="14" cy="14" r="13" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
    </svg>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: '64px !important' }}>
          <Box
            onClick={() => handleNav('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <QuantumIcon />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3B82F6, #10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              QuantumNav
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 6, flexGrow: 1 }}>
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    sx={{
                      color: active ? 'primary.light' : 'text.secondary',
                      fontWeight: active ? 600 : 400,
                      px: 2,
                      py: 0.75,
                      borderRadius: 2,
                      position: 'relative',
                      '&::after': active
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: '2px',
                            bgcolor: 'primary.main',
                            borderRadius: '1px',
                          }
                        : {},
                      '&:hover': { bgcolor: 'rgba(37,99,235,0.08)', color: 'text.primary' },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {!isMobile && (
            <Button
              variant="contained"
              onClick={() => handleNav('/planner')}
              sx={{ ml: 2, py: 0.875, fontSize: '0.875rem' }}
            >
              Launch Planner
            </Button>
          )}

          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, bgcolor: 'background.default', height: '100%', pt: 2 }}>
          <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <QuantumIcon />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.light' }}>
              QuantumNav
            </Typography>
          </Box>
          <List>
            {[{ label: 'Home', path: '/' }, ...NAV_LINKS].map((link) => (
              <ListItemButton
                key={link.path}
                onClick={() => handleNav(link.path)}
                selected={location.pathname === link.path}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(37,99,235,0.15)',
                    color: 'primary.light',
                  },
                }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Toolbar sx={{ minHeight: '64px !important' }} />
    </>
  );
}
