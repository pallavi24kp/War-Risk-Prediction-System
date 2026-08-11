import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { useDashboardState } from '../store/useDashboardState';

/**
 * Custom React Query hooks for War Risk Prediction System API Endpoints.
 * Automatically checks `isLiveMode` from Zustand store before executing requests.
 */

export function useCIIScoresQuery() {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['cii', 'latest'],
    queryFn: () => api.getCIILatest(),
    enabled: isLiveMode,
    staleTime: 1000 * 30, // 30s
    refetchInterval: 1000 * 30, // Poll every 30s
  });
}

export function useCIIHistoryQuery(countryCode: string | null) {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['cii', 'history', countryCode],
    queryFn: () => (countryCode ? api.getCIIHistory(countryCode) : Promise.resolve([])),
    enabled: isLiveMode && Boolean(countryCode),
    staleTime: 1000 * 60, // 1 min
  });
}

export function useLiveFeedQuery(region = 'middle_east', windowHours = 24) {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['liveFeed', region, windowHours],
    queryFn: () => api.getLiveFeed(region, windowHours),
    enabled: isLiveMode,
    staleTime: 1000 * 15, // 15s
    refetchInterval: 1000 * 15, // Poll every 15s
  });
}

export function useSynthesisQuery(region = 'middle_east', windowHours = 24) {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['synthesis', region, windowHours],
    queryFn: () => api.getSynthesis(region, windowHours),
    enabled: isLiveMode,
    staleTime: 1000 * 60 * 5, // 5 min TTL
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useAggressionMatrixQuery() {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['aggression', 'matrix'],
    queryFn: () => api.getAggressionMatrix(),
    enabled: isLiveMode,
    staleTime: 1000 * 60, // 60s
    refetchInterval: 1000 * 60,
  });
}

export function usePairAggressionQuery(countryA: string | null, countryB: string | null) {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);
  const isReady = Boolean(countryA && countryB && countryA !== countryB);

  return useQuery({
    queryKey: ['aggression', 'pair', countryA, countryB],
    queryFn: () => (isReady ? api.getPairAggression(countryA!, countryB!) : Promise.resolve(null)),
    enabled: isLiveMode && isReady,
    staleTime: 1000 * 30,
  });
}

export function useCascadeScoresQuery(countryCode: string | null) {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['cascade', countryCode],
    queryFn: () => (countryCode ? api.getCascadeScores(countryCode) : Promise.resolve(null)),
    enabled: isLiveMode && Boolean(countryCode),
    staleTime: 1000 * 30,
  });
}

export function useSystemHealthQuery() {
  const isLiveMode = useDashboardState((s) => s.isLiveMode);

  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => api.getHealth(),
    enabled: isLiveMode,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
  });
}
