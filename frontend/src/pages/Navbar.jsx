import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, Button, Badge } from "../components";
import { PERMISSIONS } from "../constants/permissions";
import { useCart } from "../context";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const permissions = user?.permissions || [];

  const { cartItems } = useCart();

  const NavItems = () => (
    <>
      {/* Admin/Staff Only */}
      {permissions.includes(PERMISSIONS.VIEW_INVENTORY) && (
        <NavLink to="/dashboard/inventory">Inventory</NavLink>
      )}

      {/* Admin Only */}
      {permissions.includes(PERMISSIONS.MANAGE_USERS) && (
        <>
          <NavLink to="/dashboard/admin">Admin Home</NavLink>
          <NavLink to="/dashboard/all-payments">Global Payments</NavLink>
          <NavLink to="/dashboard/users">Users List</NavLink>
        </>
      )}

      {/* Everyone */}
      <NavLink to="/dashboard/sweets">Sweets</NavLink>

      {!permissions.includes(PERMISSIONS.MANAGE_USERS) && (
        <>
          <div className="relative inline-flex">
            <NavLink to="/dashboard/basket" className="p-2">
              Cart 🛒
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {cartItems.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </NavLink>
          </div>
          <NavLink to="/dashboard/my-payments">My Orders</NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <span className="text-3xl mr-2">🍬</span>
            <h1 className="text-xl font-bold text-amber-800 mr-8">
              Sweet Shop
            </h1>
            <div className="hidden md:flex space-x-2">
              <NavItems />
            </div>
          </div>

          {/* Right Side Info */}
          <div className="hidden md:flex items-center space-x-4">
            <Badge variant="info">{user?.role?.toUpperCase()}</Badge>
            <Button variant="danger" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-amber-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar/Menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 pt-2 pb-4 space-y-2 flex flex-col shadow-inner">
          <NavItems />
          <hr />
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">{user?.email}</span>
            <Button variant="danger" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
