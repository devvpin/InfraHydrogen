import { useState, useCallback, useRef } from 'react';
import type { Map as LeafletMap, LatLngBounds } from 'leaflet';
import type { Coordinates, MapBounds, FilterState, LayerState } from '@/types/infrastructure';

export function useMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates>({
    lat: 39.8283,
    lng: -98.5795
  });
  const [currentZoom, setCurrentZoom] = useState(4);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    types: [],
    regions: [],
    status: [],
    capacityRange: { min: null, max: null }
  });

  const [layerState, setLayerState] = useState<LayerState>({
    hydrogenPlants: true,
    storageFacilities: true,
    pipelines: true,
    distributionHubs: false,
    renewableSources: false,
    demandCenters: false
  });

  const setMapRef = useCallback((map: LeafletMap | null) => {
    mapRef.current = map;
    
    if (map) {
      map.on('moveend', () => {
        const center = map.getCenter();
        setCurrentCoordinates({ lat: center.lat, lng: center.lng });
        setCurrentZoom(map.getZoom());
        
        const bounds = map.getBounds();
        setMapBounds({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        });
      });
    }
  }, []);

  const panTo = useCallback((coordinates: Coordinates, zoom?: number) => {
    if (mapRef.current) {
      mapRef.current.setView([coordinates.lat, coordinates.lng], zoom || currentZoom);
    }
  }, [currentZoom]);

  const fitBounds = useCallback((bounds: LatLngBounds) => {
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds);
    }
  }, []);

  const zoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  }, []);

  const centerMap = useCallback(() => {
    panTo({ lat: 39.8283, lng: -98.5795 }, 4);
  }, [panTo]);

  const updateFilter = useCallback((newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);

  const updateLayers = useCallback((newLayers: Partial<LayerState>) => {
    setLayerState(prev => ({ ...prev, ...newLayers }));
  }, []);

  const toggleLayer = useCallback((layer: keyof LayerState) => {
    setLayerState(prev => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  return {
    mapRef: mapRef.current,
    setMapRef,
    currentCoordinates,
    currentZoom,
    mapBounds,
    filterState,
    layerState,
    panTo,
    fitBounds,
    zoomIn,
    zoomOut,
    centerMap,
    updateFilter,
    updateLayers,
    toggleLayer
  };
}
