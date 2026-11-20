import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context";
import { PERMISSIONS } from "../constants/permissions";
import { Navbar } from "../pages";

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
  AdminPaymentPage,
  PaymentInventory,
  BasketPage
} from "../pages";

const RootRouter = () => {
  const { user, loading } = useAuth();
  const permissions = user?.permissions || user?.user?.permissions || [];

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
        path="/sweets"
        element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <SweetsPage />
            </main>
          </div>
        }
      />

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

        <Route path="basket" element={<BasketPage />} />

        <Route path="my-payments" element={<PaymentInventory />} />

        <Route
          path="all-payments"
          element={
            permissions.includes(PERMISSIONS.MANAGE_USERS) ? (
              <AdminPaymentPage />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route path="sweets" element={<SweetsPage />} />

        <Route
          path="admin"
          element={
            permissions.includes(PERMISSIONS.MANAGE_USERS) ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="inventory"
          element={
            permissions.includes(PERMISSIONS.VIEW_INVENTORY) ? (
              <InventoryPage />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="users"
          element={
            permissions.includes(PERMISSIONS.MANAGE_USERS) ? (
              <AdminUsersPage />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Route>

      {/* --- REDIRECTS & FALLBACKS --- */}
      <Route
        path="/"
        element={<Navigate to="/sweets" replace />}
      />
    </Routes>
  );
};

export default RootRouter;
