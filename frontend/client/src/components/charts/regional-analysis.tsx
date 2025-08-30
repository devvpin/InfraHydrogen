import { Progress } from '@/components/ui/progress';

interface RegionalAnalysisProps {
  data: Array<{
    region: string;
    count: number;
    capacity: number;
  }>;
}

export function RegionalAnalysis({ data }: RegionalAnalysisProps) {
  // If no data provided, use default mock data
  const defaultData = [
    { region: 'California', count: 18, capacity: 450 },
    { region: 'Texas', count: 14, capacity: 320 },
    { region: 'New York', count: 9, capacity: 180 },
    { region: 'Florida', count: 7, capacity: 140 },
    { region: 'Other States', count: 10, capacity: 200 },
  ];

  const analysisData = data.length > 0 ? data : defaultData;
  const maxCount = Math.max(...analysisData.map(item => item.count));

  return (
    <div className="space-y-3" data-testid="regional-analysis-chart">
      {analysisData.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-foreground min-w-[80px]">{item.region}</span>
          <div className="flex items-center space-x-2 flex-1 mx-3">
            <Progress 
              value={(item.count / maxCount) * 100} 
              className="flex-1 h-2"
            />
            <span className="text-xs text-muted-foreground min-w-[20px] text-right">
              {item.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
