import { useQuery } from '@tanstack/react-query';
import { listCampaigns } from '../api/campaigns.js';

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: ({ signal }) => listCampaigns(signal),
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 429) {
        return failureCount < 2;
      }
      return failureCount < 3;
    },
  });
}