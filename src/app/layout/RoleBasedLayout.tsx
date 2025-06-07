import { observer } from "mobx-react-lite";
import { useStore } from "../stores/store";
import AdminLayout from "./admin/AppLayout";
import StrategistLayout from "./strategist/AppLayout";
import ClientLayout from "./client/AppLayout";

const RoleBasedLayout = observer(() => {
  const { userStore } = useStore();
  const role = userStore.user?.role[0];

  if (role === "Admin") return <AdminLayout />;
  if (role === "Strategist") return <StrategistLayout />;
  return <ClientLayout />;
});

export default RoleBasedLayout; 