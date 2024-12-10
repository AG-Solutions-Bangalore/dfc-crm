
// src/components/Router/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ allowedPermissions }) => {
  const { isAuthenticated, user } = useAuth();


  // Check if user has required permissions
  const hasPermission = allowedPermissions 
    ? allowedPermissions.some(permission => 
        user?.permissions?.includes(permission)
      )
    : true;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  if (!hasPermission) {
    // Redirect to unauthorized page if no permission
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};



export default PrivateRoute
