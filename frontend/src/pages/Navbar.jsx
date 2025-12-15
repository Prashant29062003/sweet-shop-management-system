import {React} from 'react'
import { PERMISSIONS } from '../constants/permissions';
import { usePermission } from '../hooks/usePermission';
import { useAuth } from '../context/AuthContext';

import {NavLink, Button, Badge} from '../components';

const Navbar = () => {
  const { user, logout } = useAuth();
  const canViewInventory = usePermission(PERMISSIONS.VIEW_INVENTORY);
  const canManageUsers = usePermission(PERMISSIONS.MANAGE_USERS);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🍬</span>
              <h1 className="text-xl font-bold text-amber-800">Sweet Shop</h1>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <NavLink to="sweets">Sweets</NavLink>
              {canViewInventory && <NavLink to="inventory">Inventory</NavLink>}
              {canManageUsers && <NavLink to="users">Users</NavLink>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="info">{user?.role?.toUpperCase()}</Badge>
              <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            </div>
            <Button variant="danger" onClick={logout} className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
