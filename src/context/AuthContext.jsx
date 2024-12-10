// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
       
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
        
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/')
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};