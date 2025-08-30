import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { 
  InfrastructureAsset, 
  RenewableSource, 
  DemandCenter, 
  MLRecommendation,
  InsertInfrastructureAsset,
  InsertRenewableSource,
  InsertDemandCenter
} from '@shared/schema';
import type { AnalyticsData, MLAnalysisParams, ProximityAnalysisParams } from '@/types/infrastructure';

// Infrastructure Assets
export function useInfrastructureAssets(type?: string, region?: string) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (region) params.append('region', region);
  
  const queryString = params.toString();
  const url = queryString ? `/api/infrastructure/assets?${queryString}` : '/api/infrastructure/assets';
  
  return useQuery<InfrastructureAsset[]>({
    queryKey: ['/api/infrastructure/assets', type, region],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch infrastructure assets');
      return response.json();
    },
  });
}

export function useInfrastructureAsset(id: string) {
  return useQuery<InfrastructureAsset>({
    queryKey: ['/api/infrastructure/assets', id],
    enabled: !!id,
  });
}

export function useCreateInfrastructureAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: InsertInfrastructureAsset) => {
      const response = await apiRequest('POST', '/api/infrastructure/assets', asset);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/infrastructure/assets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
    },
  });
}

// Renewable Sources
export function useRenewableSources(type?: string) {
  const url = type ? `/api/renewable-sources?type=${type}` : '/api/renewable-sources';
  
  return useQuery<RenewableSource[]>({
    queryKey: ['/api/renewable-sources', type],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch renewable sources');
      return response.json();
    },
  });
}

export function useCreateRenewableSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (source: InsertRenewableSource) => {
      const response = await apiRequest('POST', '/api/renewable-sources', source);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/renewable-sources'] });
    },
  });
}

// Demand Centers
export function useDemandCenters(type?: string) {
  const url = type ? `/api/demand-centers?type=${type}` : '/api/demand-centers';
  
  return useQuery<DemandCenter[]>({
    queryKey: ['/api/demand-centers', type],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch demand centers');
      return response.json();
    },
  });
}

export function useCreateDemandCenter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (center: InsertDemandCenter) => {
      const response = await apiRequest('POST', '/api/demand-centers', center);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/demand-centers'] });
    },
  });
}

// ML Recommendations
export function useMLRecommendations(minScore?: number) {
  const url = minScore ? `/api/ml/recommendations?minScore=${minScore}` : '/api/ml/recommendations';
  
  return useQuery<MLRecommendation[]>({
    queryKey: ['/api/ml/recommendations', minScore],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch ML recommendations');
      return response.json();
    },
  });
}

export function useMLAnalysis() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: MLAnalysisParams) => {
      const response = await apiRequest('POST', '/api/ml/analyze', params);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ml/recommendations'] });
    },
  });
}

// Proximity Analysis
export function useProximityAnalysis() {
  return useMutation({
    mutationFn: async (params: ProximityAnalysisParams) => {
      const response = await apiRequest('POST', '/api/analysis/proximity', params);
      return response.json();
    },
  });
}

// Analytics
export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
