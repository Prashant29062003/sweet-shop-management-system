import React from "react";

import { AuthProvider, UIProvider, CartProvider } from "./context/";
import RootRouter from "./components/RootRouter";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <CartProvider>
            <RootRouter />
          </CartProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
