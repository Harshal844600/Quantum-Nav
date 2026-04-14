import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

interface ModeToggleProps {
  value: 'classic' | 'quantum';
  onChange: (mode: 'classic' | 'quantum') => void;
}

export default function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        bgcolor: 'rgba(15,23,42,0.8)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 0.5,
        position: 'relative',
        width: '100%',
      }}
    >
      {(['classic', 'quantum'] as const).map((mode) => (
        <Box
          key={mode}
          onClick={() => onChange(mode)}
          sx={{
            flex: 1,
            py: 1,
            px: 1.5,
            cursor: 'pointer',
            borderRadius: 1.5,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            transition: 'color 200ms ease',
            color: value === mode ? 'white' : 'text.secondary',
            '&:hover': { color: value === mode ? 'white' : 'text.primary' },
          }}
        >
          {value === mode && (
            <motion.div
              layoutId="modeToggleBg"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                background:
                  mode === 'quantum'
                    ? 'linear-gradient(135deg, #1D4ED8, #2563EB)'
                    : 'linear-gradient(135deg, #334155, #475569)',
                zIndex: -1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {mode === 'classic' ? 'Classic' : 'Quantum'}
          </Typography>
          {mode === 'quantum' && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontSize: '0.625rem',
                opacity: value === mode ? 0.8 : 0.4,
                letterSpacing: '0.05em',
              }}
            >
              Simulated Annealing
            </Typography>
          )}
          {mode === 'classic' && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontSize: '0.625rem',
                opacity: value === mode ? 0.8 : 0.4,
                letterSpacing: '0.05em',
              }}
            >
              Nearest Neighbor
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
