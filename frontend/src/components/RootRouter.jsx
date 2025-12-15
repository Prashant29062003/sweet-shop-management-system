import React from 'react'
import Login from '../pages/Login';
import {Dashboard} from '../pages';
import { useAuth } from '../context';

const RootRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍬</div>
          <p className="text-gray-600">Loading Sweet Shop...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
};


export default RootRouter
