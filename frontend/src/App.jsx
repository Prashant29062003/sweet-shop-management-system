import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./Layouts/AppLayout";
import Login from "./pages/Login";
import Sweets from "./pages/Sweets";
import Inventory from "./pages/Inventory";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/sweets" element={<Sweets />} />
              <Route path="/inventory" element={<Inventory />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
