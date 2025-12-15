import React from 'react'
import {Navbar, SweetsPage, InventoryPage, AdminDashboard} from './index';
import { useUI } from '../context';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../constants/permissions';

const Dashboard = () => {
  const { activeTab } = useUI();
  const canViewInventory = usePermission(PERMISSIONS.VIEW_INVENTORY);
  const canManageUsers = usePermission(PERMISSIONS.MANAGE_USERS);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'sweets' && <SweetsPage />}
        {activeTab === 'inventory' && canViewInventory && <InventoryPage />}
        {activeTab === 'users' && canManageUsers && <AdminDashboard/>}
        {!['sweets', 'inventory', 'users'].includes(activeTab) && <SweetsPage/>}
      </main>
    </div>
  );
};

export default Dashboard
