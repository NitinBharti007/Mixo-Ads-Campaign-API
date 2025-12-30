import { useQuery } from '@tanstack/react-query';
import { getCampaign } from '../api/campaigns.js';

export function useCampaignDetails(id) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: ({ signal }) => getCampaign(id, signal),
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error?.status === 429) {
        return failureCount < 2;
      }
      return failureCount < 3;
    },
  });
}