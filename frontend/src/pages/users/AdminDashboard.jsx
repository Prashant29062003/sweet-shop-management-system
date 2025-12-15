// src/pages/AdminDashboard.jsx

import React from 'react';
import Navbar from '../Navbar';
import AdminUsersPage from '../AdminUsersPage';
import SweetsPage from '../SweetsPage';
import InventoryPage from '../InventoryPage';
import { useUI } from '../../context/UIContext';
import { PERMISSIONS } from '../../constants/permissions';
import { usePermission } from '../../hooks/usePermission'; 

const AdminDashboard = () => {
  const { activeTab } = useUI();
  
  // Admin has all permissions, but we still check for consistency
  const canViewInventory = usePermission(PERMISSIONS.VIEW_INVENTORY);
  const canManageUsers = usePermission(PERMISSIONS.MANAGE_USERS);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard content rendering */}
        {activeTab === 'sweets' && <SweetsPage />}
        {activeTab === 'inventory' && canViewInventory && <InventoryPage />}
        {activeTab === 'users' && canManageUsers && <AdminUsersPage />}
        
        {/* Placeholder for default/missing tab */}
        {!['sweets', 'inventory', 'users'].includes(activeTab) && (
             <SweetsPage />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;