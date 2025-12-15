import React from 'react';

import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import RootRouter from './components/RootRouter';

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <RootRouter />
      </UIProvider>
    </AuthProvider>
  );
}
