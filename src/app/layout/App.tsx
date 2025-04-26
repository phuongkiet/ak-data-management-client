import { useLocation, useNavigate } from 'react-router';
import { useStore } from '../stores/store.ts';
import { useEffect } from 'react';
import AppLayout from './admin/AppLayout.tsx';

export default function App() {
  const { commonStore, userStore } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
      if (location.pathname !== '/signin') {
        navigate('/signin');
      }
    }
  }, [commonStore, userStore, location.pathname, navigate]);

  // const isAdminRoute = location.pathname.startsWith('/');
  // const isAdmin = userStore.user?.role.includes('Admin');

  return (
    <div className="app">
      {/*{isAdminRoute && isAdmin ? (*/}
      {/*  <AppLayout />*/}
      {/*) : (*/}
      {/*  <AppLayout />*/}
      {/*)}*/}
      <AppLayout/>
    </div>
  );
}
