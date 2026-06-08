import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, selectedSize, quantity = 1) => {
    setCartItems(prevItems => {
      const productId = product._id || product.id;
      const existingItem = prevItems.find(
        item => (item._id || item.id) === productId && item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item._id || item.id) === productId && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, selectedSize, quantity }];
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !((item._id || item.id) === productId && item.selectedSize === selectedSize))
    );
  };

  const updateQuantity = (productId, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item._id || item.id) === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9]/g, ''));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      items: [...cartItems],
      ...orderData,
      date: new Date().toISOString(),
      status: 'Processing',
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  const value = {
    cartItems,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    createOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
