import { toast } from 'react-toastify';
import { useNetworkStatus } from './useNetworkStatus';
export const useApi = () => {
  const isOnline = useNetworkStatus();

  const callApi = async <T>(
    apiCall: () => Promise<T>,
    options: {
      offlineMessage?: string;
      onOffline?: () => void;
      onError?: (error: any) => void;
    } = {}
  ): Promise<T | null> => {
    if (!isOnline) {
      if (options.offlineMessage) {
        toast.error(options.offlineMessage);
      }
      if (options.onOffline) {
        options.onOffline();
      }
      return null;
    }

    try {
      return await apiCall();
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    }
  };

  return {
    isOnline,
    callApi
  };
}; 