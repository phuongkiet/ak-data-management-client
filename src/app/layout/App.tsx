import { useLocation, useNavigate } from 'react-router';
import { useStore } from '../stores/store.ts';
import { useEffect } from 'react';
import AppLayoutBase from './admin/AppLayout.tsx';
import { ProductMetadataProvider } from '../context/ProductMetadataContext';
import { observer } from "mobx-react-lite";

const AppLayout = observer(AppLayoutBase);

const App = observer(() => {
  const { commonStore, userStore } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => {
        commonStore.setAppLoaded();
        console.log("App loaded, user:", userStore.user);
      });
    } else {
      commonStore.setAppLoaded();
      if (location.pathname !== '/signin') {
        navigate('/signin');
      }
    }
  }, [commonStore, userStore, location.pathname, navigate]);

  if (!commonStore.appLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <ProductMetadataProvider>
        <AppLayout/>
      </ProductMetadataProvider>
    </div>
  );
});

export default App;
