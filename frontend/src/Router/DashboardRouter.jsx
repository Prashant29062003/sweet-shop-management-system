import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import CustomerDashboard from "./CustomerDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "staff") return <StaffDashboard />;

  return <CustomerDashboard />;
};

export default DashboardRouter;
