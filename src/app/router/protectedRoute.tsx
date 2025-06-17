import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../stores/store.ts";
import { observer } from "mobx-react-lite";

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = observer(({ allowedRoles }: Props) => {
  const { userStore, commonStore } = useStore();
  const { user } = userStore;
  const location = useLocation();

  if (!commonStore.appLoaded) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );;
  if (!user) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(user.role[0])) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return <Outlet />;
});
