import React from "react";
import {Navbar} from "./index";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Outlet /> 
      </main>
    </div>
  );
};

export default Dashboard;