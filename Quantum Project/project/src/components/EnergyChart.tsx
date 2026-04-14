import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface EnergyChartProps {
  data: { step: number; energy: number }[];
  height?: number;
}

interface TooltipPayload {
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Step {label}
      </Typography>
      <Typography variant="body2" color="primary.light" sx={{ fontWeight: 600 }}>
        Energy: {Number(payload[0].value).toFixed(2)} km
      </Typography>
    </Box>
  );
}

export default function EnergyChart({ data, height = 200 }: EnergyChartProps) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
        <XAxis
          dataKey="step"
          tick={{ fill: '#64748B', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#1E3A5F' }}
          label={{ value: 'Steps', position: 'insideBottomRight', fill: '#64748B', fontSize: 11 }}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#1E3A5F' }}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#2563EB"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#3B82F6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
