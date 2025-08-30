import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InfrastructureAsset } from '@shared/schema';

interface AssetDetailsProps {
  asset: InfrastructureAsset | null;
  onClose: () => void;
  className?: string;
}

export function AssetDetails({ asset, onClose, className }: AssetDetailsProps) {
  if (!asset) return null;

  const getTypeDisplayName = (type: string) => {
    const names = {
      'hydrogen-plant': 'Hydrogen Production Plant',
      'storage-facility': 'Storage Facility',
      'pipeline': 'Pipeline',
      'distribution-hub': 'Distribution Hub',
    };
    return names[type as keyof typeof names] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      operational: 'bg-green-500',
      'under-construction': 'bg-yellow-500',
      planned: 'bg-blue-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants = {
      operational: 'default' as const,
      'under-construction': 'secondary' as const,
      planned: 'outline' as const,
    };
    return variants[status as keyof typeof variants] || 'outline';
  };

  return (
    <div 
      className={cn(
        "absolute top-4 right-96 w-72 p-4 bg-card/90 backdrop-blur-lg border border-border rounded-lg",
        className
      )}
      data-testid="asset-details-panel"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Asset Details</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          data-testid="button-close-asset-panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">{asset.name}</h4>
          <div className="flex items-center space-x-2 mb-3">
            <div className={cn("w-3 h-3 rounded-full", getStatusColor(asset.type))}></div>
            <span className="text-xs text-muted-foreground">{getTypeDisplayName(asset.type)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Capacity</span>
            <p className="text-foreground font-medium" data-testid="asset-capacity">
              {asset.capacity ? `${asset.capacity} ${asset.capacityUnit || 'MW'}` : 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <div className="mt-1">
              <Badge variant={getStatusVariant(asset.status)} className="text-xs">
                {asset.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Owner</span>
            <p className="text-foreground font-medium" data-testid="asset-owner">
              {asset.owner || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Year Built</span>
            <p className="text-foreground font-medium" data-testid="asset-year">
              {asset.yearBuilt || 'N/A'}
            </p>
          </div>
        </div>
        
        {asset.efficiency && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Production Efficiency</span>
              <span className="text-foreground font-medium">{asset.efficiency}%</span>
            </div>
            <Progress value={asset.efficiency} className="h-2" data-testid="asset-efficiency" />
          </div>
        )}

        {asset.estimatedCost && (
          <div>
            <span className="text-xs text-muted-foreground">Estimated Cost</span>
            <p className="text-foreground font-medium" data-testid="asset-cost">
              ${asset.estimatedCost}M USD
            </p>
          </div>
        )}

        <div>
          <span className="text-xs text-muted-foreground">Location</span>
          <p className="text-foreground font-medium text-xs" data-testid="asset-location">
            {asset.region}
          </p>
          {asset.coordinates && (
            <p className="text-muted-foreground text-xs">
              {typeof asset.coordinates === 'object' && 'lat' in asset.coordinates
                ? `${((asset.coordinates as any).lat as number).toFixed(4)}°, ${((asset.coordinates as any).lng as number).toFixed(4)}°`
                : 'Coordinates unavailable'}
            </p>
          )}
        </div>
        
        <Button
          className="w-full"
          variant="default"
          data-testid="button-view-full-report"
        >
          View Full Report
        </Button>
      </div>
    </div>
  );
}
