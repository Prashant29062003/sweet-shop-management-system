import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context";
import { PERMISSIONS } from "../constants/permissions";

// Pages
import {
  Login,
  Register,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  Dashboard,
  SweetsPage,
  InventoryPage,
  AdminDashboard,
  AdminUsersPage,
} from "../pages";

const RootRouter = () => {
  const { user, loading } = useAuth();
  const permissions = user?.permissions || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-6xl animate-bounce">🍬</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/verify-email/:verificationToken"
        element={<VerifyEmail />}
      />

      {/* --- PROTECTED DASHBOARD SHELL --- */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="sweets" replace />} />
        
        <Route path="sweets" element={<SweetsPage />} />

       <Route 
            path="admin" 
            element={permissions.includes(PERMISSIONS.MANAGE_USERS) ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
        />
        
        <Route 
            path="inventory" 
            element={permissions.includes(PERMISSIONS.VIEW_INVENTORY) ? <InventoryPage /> : <Navigate to="/dashboard" />} 
        />

        <Route 
            path="users" 
            element={permissions.includes(PERMISSIONS.MANAGE_USERS) ? <AdminUsersPage /> : <Navigate to="/dashboard" />} 
        />
      </Route>

      {/* --- REDIRECTS & FALLBACKS --- */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
};

export default RootRouter;
