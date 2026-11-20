import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { Alert } from "../components";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.user?._id;
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (userId) {
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
      setIsLoaded(true);
    }else{
      setCartItems([]);
      setIsLoaded(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && isLoaded) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userId, isLoaded]);

  const addToCart = (sweet) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === sweet._id);
      if (existing) {
        if (existing.quantity >= sweet.quantityInStock) {
          Alert(`Only ${sweet.quantityInStock} items available in stock!`);
          return prev;
        }
        return prev.map((item) =>
          item._id === sweet._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (sweet.quantityInStock < 1) {
        Alert("This item is currently out of stock!");
        return prev;
      }
      return [...prev, { ...sweet, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === id);

      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item._id !== id);
    });
  };

  const deleteItemEntirely = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        deleteItemEntirely,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
