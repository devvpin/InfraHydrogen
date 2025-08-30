import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Download, Share } from 'lucide-react';
import { InfrastructureDistribution } from '@/components/charts/infrastructure-distribution';
import { CapacityTrends } from '@/components/charts/capacity-trends';
import { RegionalAnalysis } from '@/components/charts/regional-analysis';
import { useAnalytics } from '@/hooks/use-infrastructure';
import { cn } from '@/lib/utils';

interface DataPanelProps {
  className?: string;
}

export function DataPanel({ className }: DataPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: analytics, isLoading } = useAnalytics();

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="rotate-180"
          data-testid="button-expand-data-panel"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-96 bg-card border-l border-border flex flex-col", className)} data-testid="data-panel">
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            data-testid="button-collapse-data-panel"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="p-4 border-b border-border">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-3 bg-secondary rounded-md animate-pulse">
                <div className="h-8 bg-muted rounded mb-1"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary rounded-md" data-testid="kpi-total-capacity">
              <div className="text-2xl font-bold text-primary">
                {analytics?.totalCapacity ? `${formatNumber(analytics.totalCapacity)} W` : '0 GW'}
              </div>
              <div className="text-xs text-muted-foreground">Total Capacity</div>
              <div className="text-xs text-green-400 mt-1">+12% this quarter</div>
            </div>
            
            <div className="p-3 bg-secondary rounded-md" data-testid="kpi-active-projects">
              <div className="text-2xl font-bold text-primary">
                {analytics?.activeProjects || 0}
              </div>
              <div className="text-xs text-muted-foreground">Active Projects</div>
              <div className="text-xs text-green-400 mt-1">+5 new projects</div>
            </div>
            
            <div className="p-3 bg-secondary rounded-md" data-testid="kpi-efficiency">
              <div className="text-2xl font-bold text-primary">
                {analytics?.averageEfficiency ? `${Math.round(analytics.averageEfficiency)}%` : '0%'}
              </div>
              <div className="text-xs text-muted-foreground">Avg Efficiency</div>
              <div className="text-xs text-yellow-400 mt-1">-2% from target</div>
            </div>
            
            <div className="p-3 bg-secondary rounded-md" data-testid="kpi-investment">
              <div className="text-2xl font-bold text-primary">
                {analytics?.totalInvestment ? `$${formatNumber(analytics.totalInvestment * 1000000)}` : '$0'}
              </div>
              <div className="text-xs text-muted-foreground">Total Investment</div>
              <div className="text-xs text-green-400 mt-1">+23% YoY</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Charts Section */}
      <div className="flex-1 overflow-y-auto">
        {/* Infrastructure Distribution Chart */}
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Infrastructure Distribution</h4>
          <InfrastructureDistribution data={analytics?.typeDistribution || []} />
        </div>
        
        {/* Capacity Trends Chart */}
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Capacity Growth Trends</h4>
          <CapacityTrends />
        </div>
        
        {/* Regional Analysis */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Regional Analysis</h4>
          <RegionalAnalysis data={analytics?.regionDistribution || []} />
        </div>
      </div>
    </div>
  );
}
