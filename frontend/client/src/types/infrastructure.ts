export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterState {
  types: string[];
  regions: string[];
  status: string[];
  capacityRange: {
    min: number | null;
    max: number | null;
  };
}

export interface LayerState {
  hydrogenPlants: boolean;
  storageFacilities: boolean;
  pipelines: boolean;
  distributionHubs: boolean;
  renewableSources: boolean;
  demandCenters: boolean;
}

export interface AnalyticsData {
  totalCapacity: number;
  activeProjects: number;
  averageEfficiency: number;
  totalInvestment: number;
  regionDistribution: Array<{
    region: string;
    count: number;
    capacity: number;
  }>;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

export interface ProximityAnalysisParams {
  lat: number;
  lng: number;
  radius: number;
}

export interface MLAnalysisParams {
  criteria?: {
    proximityWeight?: number;
    demandWeight?: number;
    regulatoryWeight?: number;
    costWeight?: number;
  };
  maxResults?: number;
}
