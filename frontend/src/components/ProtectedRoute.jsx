import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePermission } from "../hooks/usePermission";

const ProtectedRoute = ({ permission, children }) => {
  const { user, loading } = useAuth();
  const allowed = usePermission(permission);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-600"></div>
    </div>
  );
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (permission && !allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
