import { useLocation, useNavigate } from 'react-router';
import { useStore } from '../stores/store.ts';
import { useEffect } from 'react';
import RoleBasedLayout from './RoleBasedLayout.tsx';
import { ProductMetadataProvider } from '../context/ProductMetadataContext';
import { observer } from "mobx-react-lite";
import { SyncService } from '../services/syncService';
import { NetworkStatus } from '../components/common/NetworkStatus';

const App = observer(() => {
  const { commonStore, userStore } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => {
        commonStore.setAppLoaded();
        if (location.pathname === '/signin') {
          navigate('/');
        }
      });
    } else {
      commonStore.setAppLoaded();
      if (location.pathname !== '/signin') {
        navigate('/signin');
      }
    }
  }, [commonStore.token, location.pathname, navigate, userStore]);

  // Initialize sync service
  useEffect(() => {
    SyncService.init();
  }, []);

  if (!commonStore.appLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <NetworkStatus>
      <div className="app">
        <ProductMetadataProvider>
          <RoleBasedLayout/>
        </ProductMetadataProvider>
      </div>
    </NetworkStatus>
  );
});

export default App;
