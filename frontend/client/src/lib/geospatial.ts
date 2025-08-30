import * as turf from '@turf/turf';
import type { Coordinates } from '@/types/infrastructure';

export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const from = turf.point([point1.lng, point1.lat]);
  const to = turf.point([point2.lng, point2.lat]);
  return turf.distance(from, to, { units: 'kilometers' });
}

export function createBuffer(center: Coordinates, radiusKm: number): GeoJSON.Feature<GeoJSON.Polygon> {
  const point = turf.point([center.lng, center.lat]);
  return turf.buffer(point, radiusKm, { units: 'kilometers' });
}

export function isPointInPolygon(point: Coordinates, polygon: GeoJSON.Feature<GeoJSON.Polygon>): boolean {
  const turfPoint = turf.point([point.lng, point.lat]);
  return turf.booleanPointInPolygon(turfPoint, polygon);
}

export function findNearestAssets<T extends { coordinates: Coordinates }>(
  targetPoint: Coordinates,
  assets: T[],
  maxCount: number = 5
): Array<T & { distance: number }> {
  return assets
    .map(asset => ({
      ...asset,
      distance: calculateDistance(targetPoint, asset.coordinates)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxCount);
}

export function calculateCentroid(points: Coordinates[]): Coordinates {
  if (points.length === 0) {
    throw new Error('Cannot calculate centroid of empty array');
  }

  const features = points.map(point => turf.point([point.lng, point.lat]));
  const collection = turf.featureCollection(features);
  const centroid = turf.centroid(collection);
  
  return {
    lat: centroid.geometry.coordinates[1],
    lng: centroid.geometry.coordinates[0]
  };
}

export function createCluster(points: Coordinates[], radiusKm: number): Coordinates[][] {
  const features = points.map((point, index) => 
    turf.point([point.lng, point.lat], { index })
  );
  
  const clustered = turf.clustersKmeans(turf.featureCollection(features), {
    numberOfClusters: Math.max(1, Math.floor(points.length / 3))
  });

  const clusters: Coordinates[][] = [];
  const clusterMap = new Map<number, Coordinates[]>();

  clustered.features.forEach((feature: any) => {
    const cluster = feature.properties?.cluster || 0;
    const originalIndex = feature.properties?.index || 0;
    
    if (!clusterMap.has(cluster)) {
      clusterMap.set(cluster, []);
    }
    
    clusterMap.get(cluster)!.push(points[originalIndex]);
  });

  return Array.from(clusterMap.values());
}

export function calculateOptimalLocation(
  demandCenters: Array<{ coordinates: Coordinates; estimatedDemand: number }>,
  renewableSources: Array<{ coordinates: Coordinates; capacity: number }>
): Coordinates {
  // Weight demand centers by their demand
  const weightedDemandPoints = demandCenters.flatMap(center =>
    Array(Math.ceil(center.estimatedDemand / 100)).fill(center.coordinates)
  );

  // Weight renewable sources by their capacity
  const weightedRenewablePoints = renewableSources.flatMap(source =>
    Array(Math.ceil(source.capacity / 50)).fill(source.coordinates)
  );

  // Combine all weighted points
  const allPoints = [...weightedDemandPoints, ...weightedRenewablePoints];
  
  if (allPoints.length === 0) {
    // Default to center of USA if no data
    return { lat: 39.8283, lng: -98.5795 };
  }

  return calculateCentroid(allPoints);
}
