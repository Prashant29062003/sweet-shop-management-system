import React from "react";

import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import RootRouter from "./components/RootRouter";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <RootRouter />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
