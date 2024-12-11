// src/utils/authUtils.js
export const getUserRole = () => {
    return localStorage.getItem('userRole') || 'GUEST';
  };
  
  export const hasPermission = (requiredPermissions) => {
    const userRole = getUserRole();
    
    // Define role-based permissions
    const rolePermissions = {
      ADMIN: ['ADMIN', 'MANAGER', 'USER', 'VIEW', 'CREATE', 'UPDATE', 'DELETE'],
      MANAGER: ['MANAGER', 'USER', 'VIEW', 'CREATE', 'UPDATE'],
      USER: ['USER', 'VIEW'],
      GUEST: ['VIEW']
    };
  
    // Check if user's role has any of the required permissions
    return requiredPermissions.some(permission => 
      rolePermissions[userRole]?.includes(permission)
    );
  };
  
  export const setUserRole = (role) => {
    localStorage.setItem('userRole', role);
  };
  
  export const clearUserRole = () => {
    localStorage.removeItem('userRole');
  };








  // src/components/Router/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { hasPermission, getUserRole } from '../../utils/authUtils';

const PrivateRoute = ({ allowedPermissions }) => {
  const userRole = getUserRole();
  const isAuthenticated = !!userRole && userRole !== 'GUEST';

  // If no specific permissions are required, just check authentication
  const canAccess = allowedPermissions 
    ? hasPermission(allowedPermissions)
    : isAuthenticated;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  if (!canAccess) {
    // Redirect to unauthorized page if no permission
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;









// src/pages/auth/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserRole } from '../../utils/authUtils';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call for authentication
      const response = await authenticateUser(email, password);
      
      if (response.success) {
        // Set user role in localStorage
        setUserRole(response.role); // e.g., 'ADMIN', 'MANAGER', 'USER'
        
        // Redirect to dashboard
        navigate('/home');
      } else {
        // Handle login failure
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  // Mock authentication function (replace with actual API call)
  const authenticateUser = async (email, password) => {
    // Simulate different roles based on email
    if (email === 'admin@example.com') {
      return { 
        success: true, 
        role: 'ADMIN',
        token: 'admin-token' 
      };
    } else if (email === 'manager@example.com') {
      return { 
        success: true, 
        role: 'MANAGER',
        token: 'manager-token' 
      };
    } else if (email === 'user@example.com') {
      return { 
        success: true, 
        role: 'USER',
        token: 'user-token' 
      };
    }
    
    return { success: false };
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignIn;










// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/home">Go to Home</Link>
    </div>
  );
};

export default UnauthorizedPage;