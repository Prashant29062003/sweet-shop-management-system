import { NavLink as RouterNavLink } from "react-router-dom";

import React from 'react'

const NavLink = ({ to, children }) => {
  return (
    <RouterNavLink
      to={to.startsWith('/') ? to : `/dashboard/${to}`}
      className={({ isActive }) =>
        `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-amber-100 text-amber-800 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
    >
      {children}
    </RouterNavLink>
  );
};


export default NavLink