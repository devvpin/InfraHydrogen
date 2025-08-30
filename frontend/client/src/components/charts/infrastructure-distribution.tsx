import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface InfrastructureDistributionProps {
  data: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = {
  'hydrogen-plant': '#10B981',
  'storage-facility': '#3B82F6',
  'pipeline': '#F59E0B',
  'distribution-hub': '#8B5CF6',
};

const TYPE_LABELS = {
  'hydrogen-plant': 'Plants',
  'storage-facility': 'Storage',
  'pipeline': 'Pipelines',
  'distribution-hub': 'Distribution',
};

export function InfrastructureDistribution({ data }: InfrastructureDistributionProps) {
  const chartData = data.map(item => ({
    name: TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] || item.type,
    value: item.count,
    percentage: item.percentage,
    color: COLORS[item.type as keyof typeof COLORS] || '#6B7280',
  }));

  const totalAssets = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-foreground font-medium">{data.payload.name}</p>
          <p className="text-muted-foreground text-sm">
            {data.value} assets ({Math.round(data.payload.percentage)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container p-3 bg-secondary rounded-md" data-testid="infrastructure-distribution-chart">
      <div className="relative w-full h-40">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold fill-foreground"
              >
                {totalAssets}
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-muted-foreground"
              >
                Total Assets
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-3 space-y-2 text-xs">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-foreground">{item.name}</span>
            </div>
            <span className="text-muted-foreground">
              {item.value} ({Math.round(item.percentage)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
