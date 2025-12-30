import { useQuery } from '@tanstack/react-query';
import { getCampaignInsights } from '../api/campaigns.js';

export function useCampaignInsights(id, enabled = true) {
  return useQuery({
    queryKey: ['campaign-insights', id],
    queryFn: ({ signal }) => getCampaignInsights(id, signal),
    enabled: !!id && enabled,
    retry: (failureCount, error) => {
      if (error?.status === 429) {
        return failureCount < 2;
      }
      return failureCount < 3;
    },
  });
}