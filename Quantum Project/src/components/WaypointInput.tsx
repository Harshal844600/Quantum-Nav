import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { Waypoint } from '../lib/quantumSolver';
import { searchPlaces, detectUserLocation, validateCoordinates, getLocationAccuracy, type Place } from '../lib/places';

const PIN_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#2563EB', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

interface WaypointInputProps {
  waypoints: Waypoint[];
  onAdd: (waypoint: Waypoint) => void;
  onRemove: (id: string) => void;
  onReorder: (waypoints: Waypoint[]) => void;
  onPreview?: (place: Place | null) => void;
}

export default function WaypointInput({ waypoints, onAdd, onRemove, onReorder, onPreview }: WaypointInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [detectionLoading, setDetectionLoading] = useState(false);
  const idCounterRef = useRef(0);

  const generateId = () => {
    idCounterRef.current += 1;
    return `wp-${Date.now()}-${idCounterRef.current}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Check if input is coordinates
    const coords = validateCoordinates(value);
    if (coords) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (onPreview) {
        onPreview(null);
      }
      return;
    }

    // Show suggestions if there's input
    if (value.trim()) {
      const matches = searchPlaces(value, userLocation ?? undefined, 60); // Show all matching places
      setSuggestions(matches);
      setShowSuggestions(true);

      // Show preview of first suggestion with valid coordinates
      if (matches.length > 0 && onPreview && typeof matches[0]?.lat === 'number' && typeof matches[0]?.lng === 'number') {
        onPreview(matches[0]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      if (onPreview) {
        onPreview(null);
      }
    }
  };

  const handleDetectLocation = async () => {
    setDetectionLoading(true);
    try {
      const location = await detectUserLocation();
      if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
        setUserLocation(location);
        setInput(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setDetectionLoading(false);
    }
  };

  const handleSelectPlace = (place: Place | null | undefined) => {
    if (!place || typeof place.lat !== 'number' || typeof place.lng !== 'number') {
      return; // Silently ignore invalid places
    }
    onAdd({
      id: generateId(),
      lat: place.lat,
      lng: place.lng,
      label: place.name,
    });
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onPreview) {
      onPreview(null);
    }
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed || waypoints.length >= 10) return;

    const coords = validateCoordinates(trimmed);
    if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      onAdd({
        id: generateId(),
        lat: coords.lat,
        lng: coords.lng,
        label: trimmed,
      });
    } else {
      // Use user location if available, otherwise default to global center
      const center = (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') 
        ? userLocation 
        : { lat: 20.5937, lng: 78.9629 }; // Center of world (India region)
      const jitter = () => (Math.random() - 0.5) * 0.15;
      onAdd({
        id: generateId(),
        lat: center.lat + jitter(),
        lng: center.lng + jitter(),
        label: trimmed,
      });
    }
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onPreview) {
      onPreview(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, position: 'relative' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add stop (name or lat,lng)"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              if (suggestions.length > 0 && showSuggestions) {
                handleSelectPlace(suggestions[0]);
              } else {
                handleAdd();
              }
            }
          }}
          onFocus={() => {
            if (input.trim() && suggestions.length > 0 && !validateCoordinates(input)) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          disabled={waypoints.length >= 10}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(15,23,42,0.6)',
              fontSize: '0.875rem',
              '& fieldset': { borderColor: '#334155' },
              '&:hover fieldset': { borderColor: '#475569' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 60,
                zIndex: 10,
                marginTop: 4,
              }}
            >
              <Paper
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  maxHeight: 500,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    bgcolor: 'rgba(100,116,139,0.1)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(100,116,139,0.3)',
                    borderRadius: '4px',
                    '&:hover': {
                      bgcolor: 'rgba(100,116,139,0.5)',
                    },
                  },
                }}
              >
                {/* Suggestions Header */}
                <Box
                  sx={{
                    p: 1,
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(59,130,246,0.05) 100%)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {suggestions.length} locations found
                  </Typography>
                </Box>

                {/* Suggestions List */}
                {suggestions.map((place, idx) => {
                  // Calculate distance from user location
                  const distance = userLocation && place && typeof place.lat === 'number' && typeof place.lng === 'number' && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number' ? Math.sqrt(
                    Math.pow(place.lat - userLocation.lat, 2) + 
                    Math.pow(place.lng - userLocation.lng, 2)
                  ) * 111 : null; // Rough km conversion
                  
                  return (
                  <Box
                    key={place?.id}
                    onMouseDown={() => handleSelectPlace(place)}
                    sx={{
                      p: 1.25,
                      cursor: 'pointer',
                      borderBottom: idx < suggestions.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      transition: 'all 150ms ease',
                      '&:hover': {
                        bgcolor: 'rgba(37,99,235,0.15)',
                      },
                      display: 'flex',
                      gap: 1.25,
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Mini Map Preview */}
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        minWidth: 60,
                        bgcolor: 'rgba(37,99,235,0.08)',
                        border: '1px solid rgba(37,99,235,0.15)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Map Grid Background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          opacity: 0.3,
                          width: '100%',
                          height: '100%',
                          backgroundImage: 'linear-gradient(rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.1) 1px, transparent 1px)',
                          backgroundSize: '10px 10px',
                        }}
                      />
                      
                      {/* Location Pin */}
                      <LocationOnIcon
                        sx={{
                          fontSize: 24,
                          color: '#2563EB',
                          position: 'relative',
                          zIndex: 2,
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                        }}
                      />
                      
                      {/* Ripple Effect */}
                      <Box
                        sx={{
                          position: 'absolute',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          border: '2px solid rgba(37,99,235,0.3)',
                          zIndex: 1,
                        }}
                      />
                    </Box>

                    {/* Location Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Title Row */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: '#0F172A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {place?.name || 'Unknown Location'}
                        </Typography>
                        {place?.country && (
                          <Chip
                            label={place.country}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              bgcolor: 'rgba(16,185,129,0.15)',
                              color: '#10B981',
                            }}
                          />
                        )}
                      </Box>

                      {/* Coordinates Row (Google Maps Style) */}
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          fontFamily: 'monospace',
                          fontSize: '0.7rem',
                          color: '#64748B',
                          mb: 0.4,
                          bgcolor: 'rgba(100,116,139,0.05)',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          fontWeight: 500,
                        }}
                      >
                        📍 {(typeof place?.lat === 'number' ? place.lat.toFixed(6) : '?')}, {(typeof place?.lng === 'number' ? place.lng.toFixed(6) : '?')}
                      </Typography>

                      {/* Details Row */}
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
                        {place?.category && (
                          <Chip
                            label={place?.category}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.6rem',
                              bgcolor: 'rgba(139,92,246,0.15)',
                              color: '#8B5CF6',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        
                        {distance !== null && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.65rem',
                              color: '#2563EB',
                              fontWeight: 600,
                            }}
                          >
                            📍 {distance.toFixed(1)} km
                          </Typography>
                        )}

                        {place?.accuracy !== undefined && place && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box
                              sx={{
                                width: 3,
                                height: 3,
                                borderRadius: '50%',
                                bgcolor: (place?.accuracy ?? 0) >= 90 ? '#10B981' : (place?.accuracy ?? 0) >= 75 ? '#F59E0B' : '#EF4444',
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.6rem',
                                color: (place?.accuracy ?? 0) >= 90 ? '#10B981' : (place?.accuracy ?? 0) >= 75 ? '#F59E0B' : '#EF4444',
                                fontWeight: 600,
                              }}
                            >
                              {getLocationAccuracy(place).level}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {place?.city && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontSize: '0.65rem',
                            color: '#71717A',
                            mt: 0.3,
                          }}
                        >
                          {place?.city} • {place?.population ? `${(place.population / 1000000).toFixed(1)}M` : 'City'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
                })}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip title="Use my location">
          <span>
            <IconButton
              onClick={handleDetectLocation}
              disabled={waypoints.length >= 10 || detectionLoading}
              sx={{
                bgcolor: 'rgba(139,92,246,0.2)',
                color: '#8B5CF6',
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(139,92,246,0.3)' },
                '&:disabled': { bgcolor: 'rgba(139,92,246,0.1)' },
              }}
            >
              {detectionLoading ? (
                <CircularProgress size={20} sx={{ color: '#8B5CF6' }} />
              ) : (
                <MyLocationIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Add stop">
          <span>
            <IconButton
              onClick={handleAdd}
              disabled={waypoints.length >= 10 || !input.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'rgba(37,99,235,0.2)' },
              }}
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {waypoints.length}/10 stops
        </Typography>
        <Chip
          label="Drag to reorder"
          size="small"
          sx={{ fontSize: '0.6875rem', height: 20, bgcolor: 'rgba(37,99,235,0.1)', color: 'primary.light' }}
        />
      </Box>

      <Reorder.Group
        axis="y"
        values={waypoints}
        onReorder={onReorder}
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        <AnimatePresence>
          {waypoints.filter(wp => wp && typeof wp.id === 'string').map((wp, index) => (
            <Reorder.Item key={wp.id} value={wp} style={{ listStyle: 'none' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(30,41,59,0.7)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                    mb: 0.75,
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                    transition: 'border-color 200ms ease',
                    '&:hover': { borderColor: 'rgba(37,99,235,0.4)' },
                  }}
                >
                  <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 18, flexShrink: 0 }} />
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      bgcolor: PIN_COLORS[index % PIN_COLORS.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 14, color: 'white' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.8125rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {wp?.label ?? 'Unknown Location'}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6875rem' }}>
                      {(wp && typeof wp.lat === 'number' ? wp.lat.toFixed(4) : '?')}, {(wp && typeof wp.lng === 'number' ? wp.lng.toFixed(4) : '?')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: PIN_COLORS[index % PIN_COLORS.length] + '33',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: PIN_COLORS[index % PIN_COLORS.length],
                    }}
                  >
                    {index + 1}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => onRemove(wp.id)}
                    sx={{
                      color: 'text.disabled',
                      p: 0.25,
                      '&:hover': { color: 'error.main', bgcolor: 'rgba(239,68,68,0.1)' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </Box>
  );
}
