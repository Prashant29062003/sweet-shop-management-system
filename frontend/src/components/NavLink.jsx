import { useUI } from "../context/UIContext";

import React from 'react'

const NavLink = ({ to, children }) => {
  const { activeTab, setActiveTab } = useUI();
  return (
    <button
      onClick={() => setActiveTab(to)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === to
          ? 'bg-amber-50 text-amber-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
};


export default NavLink