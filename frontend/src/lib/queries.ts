import { useQuery } from '@tanstack/react-query';
import { settingsApi } from './api';

// Settings query
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await settingsApi.get();
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 1,
    refetchOnWindowFocus: false,
  });
};