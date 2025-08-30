import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Mock data for capacity trends over time
const trendData = [
  { year: '2020', capacity: 1200 },
  { year: '2021', capacity: 1500 },
  { year: '2022', capacity: 1900 },
  { year: '2023', capacity: 2200 },
  { year: '2024', capacity: 2400 },
];

export function CapacityTrends() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-primary text-sm">
            {payload[0].value} MW
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container p-3 bg-secondary rounded-md" data-testid="capacity-trends-chart">
      <div className="relative w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" opacity={0.3} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10, fill: 'hsl(215 20% 65%)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="capacity"
              stroke="#14B8A6"
              strokeWidth={2}
              fill="url(#capacityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        <span>Growth Rate: +23% annually</span>
      </div>
    </div>
  );
}
