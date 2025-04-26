import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useStore} from "../stores/store.ts";

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles } : Props) => {
  const { userStore } = useStore();
  const {user} = userStore;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role[0])) {
    return <Navigate to='/' state={{from: location}}/>
  }

  return <Outlet/>;
};