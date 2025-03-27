// App.jsx - Main entry point for the SustainaBite application
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Ordering from './components/Ordering';
import Inventory from './components/Inventory';
import Analytics from './components/Analytics';
import Prediction from './components/Prediction'; // Import the new Prediction component
import Login from './components/Login';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import AuthContext from './contexts/AuthContext';
import CartContext from './contexts/CartContext';
import NotificationContext from './contexts/NotificationContext';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('sustainabite_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sustainabite_user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sustainabite_user');
    setCart([]);
  };

  // Add to cart function
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">กำลังโหลด...</div>;
  }

  return (
    <Router>
      <AuthContext.Provider value={{ user, login, logout }}>
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItemQuantity }}>
          <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            <Notifications /> {/* Global notifications component */}
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/order" element={user ? <Ordering /> : <Navigate to="/login" />} />
              <Route path="/inventory" element={user ? <Inventory /> : <Navigate to="/login" />} />
              <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
              <Route path="/prediction" element={user ? <Prediction /> : <Navigate to="/login" />} /> {/* New prediction route */}
              <Route path="/order-confirmation/:orderId" element={user ? <OrderConfirmation /> : <Navigate to="/login" />} />
              <Route path="/order-history" element={user ? <OrderHistory /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </NotificationContext.Provider>
        </CartContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;