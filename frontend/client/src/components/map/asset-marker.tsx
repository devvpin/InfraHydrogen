import { Marker, Popup } from 'react-leaflet';
import type { InfrastructureAsset } from '@shared/schema';
import type { Icon } from 'leaflet';

interface AssetMarkerProps {
  asset: InfrastructureAsset;
  position: [number, number];
  icon: Icon;
  isSelected: boolean;
  onClick: () => void;
}

export function AssetMarker({ asset, position, icon, isSelected, onClick }: AssetMarkerProps) {
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
      operational: 'text-green-400',
      'under-construction': 'text-yellow-400',
      planned: 'text-blue-400',
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
      data-testid={`marker-asset-${asset.id}`}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{asset.name}</h3>
            {isSelected && (
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            )}
          </div>
          
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">{getTypeDisplayName(asset.type)}</p>
            
            {asset.capacity && (
              <p className="text-foreground">
                Capacity: {asset.capacity} {asset.capacityUnit || 'MW'}
              </p>
            )}
            
            <p className={`capitalize ${getStatusColor(asset.status)}`}>
              Status: {asset.status.replace('-', ' ')}
            </p>
            
            {asset.owner && (
              <p className="text-muted-foreground">Owner: {asset.owner}</p>
            )}
            
            {asset.yearBuilt && (
              <p className="text-muted-foreground">Built: {asset.yearBuilt}</p>
            )}
            
            {asset.efficiency && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Efficiency: {asset.efficiency}%
                </p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${asset.efficiency}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">{asset.region}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
