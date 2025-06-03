import React from 'react';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { toast } from 'react-toastify';

interface NetworkStatusProps {
  children: React.ReactNode;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ children }) => {
  const isOnline = useNetworkStatus();

  React.useEffect(() => {
    if (!isOnline) {
      toast.warning('Bạn đang ở chế độ offline. Một số tính năng có thể bị hạn chế.', {
        autoClose: false,
        position: "bottom-right"
      });
    } else {
      toast.dismiss(); // Dismiss the offline warning when back online
    }
  }, [isOnline]);

  return <>{children}</>;
}; 