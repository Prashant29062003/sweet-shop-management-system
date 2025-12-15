import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermission } from "../hooks/usePermission";

const ProtectedRoute = ({ permission, children }) => {
  const { user, loading } = useAuth();
  const allowed = usePermission(permission);

  if (loading) return null;
  if (!user || !allowed) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
