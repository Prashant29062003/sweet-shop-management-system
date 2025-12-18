import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { Alert } from "../components";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user?._id) {
      const savedCart = localStorage.getItem(`cart_${user._id}`);
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
  }, [user?._id]);

  useEffect(() => {
    if (user?._id && isLoaded) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user?._id, isLoaded]);

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
