import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cartService } from "../services/cartService";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart state from service layer on mount
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCartItems(data?.items || []);
    } catch (err) {
      console.warn("Failed to retrieve cart items from service, fallback to recovery store", err);
      try {
        const stored = localStorage.getItem("bytevault_cart_items");
        setCartItems(stored ? JSON.parse(stored) : []);
      } catch {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totals = cartService.calculateTotals(cartItems);

  // Sync updates back to the service layer and fallback storage
  const syncCart = async (nextItems) => {
    setCartItems(nextItems);
    try {
      await cartService.saveCart({ items: nextItems });
    } catch (err) {
      console.warn("Failed to sync cart changes to service layer", err);
    }
    try {
      localStorage.setItem("bytevault_cart_items", JSON.stringify(nextItems));
    } catch (e) {
      console.error("Failed to write cart backup to local recovery store", e);
    }
  };

  // Adds a product to the basket
  const addItem = (product) => {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    const isDigital = product.type === "DIGITAL" || product.type === "digital";
    const itemType = isDigital ? "DIGITAL" : "PHYSICAL";

    const updated = [...cartItems];
    if (existingIndex > -1) {
      // Enforce digital restriction: Quantity is always capped at 1
      if (itemType === "DIGITAL") {
        return;
      }
      
      // Physical products increment quantity
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
    } else {
      // Add as new item
      updated.push({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        type: itemType,
        quantity: 1,
        deliveryInfo: product.deliveryInfo,
        inStock: product.inStock
      });
    }
    syncCart(updated);
  };

  // Adjusts item quantities
  const updateQuantity = (productId, quantity) => {
    const updated = cartItems.map((item) => {
      if (item.id === productId) {
        // Digital items cannot exceed a quantity of 1
        if (item.type === "DIGITAL") {
          return { ...item, quantity: 1 };
        }
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    syncCart(updated);
  };

  // Removes item from cart
  const removeItem = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    syncCart(updated);
  };

  // Empties cart
  const clearCart = () => {
    syncCart([]);
  };

  const value = {
    cartItems,
    totals,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    retryLoad: loadCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
