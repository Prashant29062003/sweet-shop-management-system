import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider, UIProvider, CartProvider } from "./context/";
import RootRouter from "./components/RootRouter";
import { BrowserRouter } from "react-router-dom";


export default function App() {
  const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <CartProvider>
            <GoogleOAuthProvider clientId={googleId}>
              <RootRouter />
            </GoogleOAuthProvider>
          </CartProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
