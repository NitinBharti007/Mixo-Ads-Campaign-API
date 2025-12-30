import { useQuery } from '@tanstack/react-query';
import { getAggregateInsights } from '../api/campaigns.js';

export function useAggregateInsights() {
  return useQuery({
    queryKey: ['aggregate-insights'],
    queryFn: ({ signal }) => getAggregateInsights(signal),
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 429) {
        return failureCount < 2;
      }
      return failureCount < 3;
    },
  });
}