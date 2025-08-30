import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap as useLeafletMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { AssetMarker } from './asset-marker';
import { useInfrastructureAssets, useRenewableSources, useDemandCenters } from '@/hooks/use-infrastructure';
import { useMap } from '@/hooks/use-map';
import type { InfrastructureAsset, RenewableSource, DemandCenter } from '@shared/schema';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createMarkerIcon = (type: string, color: string) => {
  return divIcon({
    className: `infrastructure-marker ${type}`,
    html: `<div style="background: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const markerIcons = {
  'hydrogen-plant': createMarkerIcon('hydrogen-plant', '#10B981'),
  'storage-facility': createMarkerIcon('storage-facility', '#3B82F6'),
  'pipeline': createMarkerIcon('pipeline', '#F59E0B'),
  'distribution-hub': createMarkerIcon('distribution-hub', '#8B5CF6'),
  'renewable-source': createMarkerIcon('renewable-source', '#14B8A6'),
  'demand-center': createMarkerIcon('demand-center', '#EF4444'),
};

interface MapControllerProps {
  onMapReady: (map: L.Map) => void;
}

function MapController({ onMapReady }: MapControllerProps) {
  const map = useLeafletMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (map && !hasInitialized.current) {
      onMapReady(map);
      hasInitialized.current = true;
    }
  }, [map, onMapReady]);

  return null;
}

interface InteractiveMapProps {
  selectedAsset: InfrastructureAsset | null;
  onAssetSelect: (asset: InfrastructureAsset | null) => void;
  className?: string;
}

export function InteractiveMap({ selectedAsset, onAssetSelect, className }: InteractiveMapProps) {
  const { setMapRef, layerState, filterState } = useMap();
  
  const { data: infrastructureAssets = [] } = useInfrastructureAssets();
  const { data: renewableSources = [] } = useRenewableSources();
  const { data: demandCenters = [] } = useDemandCenters();

  // Filter assets based on current filter state
  const filteredAssets = infrastructureAssets.filter(asset => {
    // Type filter
    if (filterState.types.length > 0 && !filterState.types.includes(asset.type)) {
      return false;
    }
    
    // Region filter
    if (filterState.regions.length > 0 && !filterState.regions.includes(asset.region)) {
      return false;
    }
    
    // Status filter
    if (filterState.status.length > 0 && !filterState.status.includes(asset.status)) {
      return false;
    }
    
    // Capacity filter
    if (filterState.capacityRange.min !== null && asset.capacity && asset.capacity < filterState.capacityRange.min) {
      return false;
    }
    
    if (filterState.capacityRange.max !== null && asset.capacity && asset.capacity > filterState.capacityRange.max) {
      return false;
    }
    
    return true;
  });

  const renderInfrastructureMarkers = () => {
    return filteredAssets.map(asset => {
      const shouldShow = layerState[asset.type.replace('-', '') as keyof typeof layerState] ?? false;
      if (!shouldShow) return null;

      const coords = asset.coordinates as { lat: number; lng: number };
      
      return (
        <AssetMarker
          key={asset.id}
          asset={asset}
          position={[coords.lat, coords.lng]}
          icon={markerIcons[asset.type as keyof typeof markerIcons]}
          isSelected={selectedAsset?.id === asset.id}
          onClick={() => onAssetSelect(asset)}
        />
      );
    });
  };

  const renderRenewableMarkers = () => {
    if (!layerState.renewableSources) return null;

    return renewableSources.map(source => {
      const coords = source.coordinates as { lat: number; lng: number };
      
      return (
        <Marker
          key={source.id}
          position={[coords.lat, coords.lng]}
          icon={markerIcons['renewable-source']}
          data-testid={`marker-renewable-${source.id}`}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-foreground">{source.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{source.type} - {source.capacity} MW</p>
              <p className="text-xs text-muted-foreground">{source.region}</p>
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  const renderDemandMarkers = () => {
    if (!layerState.demandCenters) return null;

    return demandCenters.map(center => {
      const coords = center.coordinates as { lat: number; lng: number };
      
      return (
        <Marker
          key={center.id}
          position={[coords.lat, coords.lng]}
          icon={markerIcons['demand-center']}
          data-testid={`marker-demand-${center.id}`}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-foreground">{center.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{center.type}</p>
              <p className="text-sm text-muted-foreground">Demand: {center.estimatedDemand} tons/year</p>
              <p className="text-xs text-muted-foreground">{center.region}</p>
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  return (
    <div className={className} data-testid="interactive-map">
      <MapContainer
        center={[39.8283, -98.5795] as [number, number]}
        zoom={4}
        className="w-full h-full"
        style={{ background: 'hsl(222 84% 5%)' }}
      >
        <MapController onMapReady={setMapRef} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className="map-tiles"
        />
        
        {renderInfrastructureMarkers()}
        {renderRenewableMarkers()}
        {renderDemandMarkers()}
      </MapContainer>
    </div>
  );
}
