// src/routes/routeConfig.js
import { lazy } from 'react';

// Utility to create lazy-loaded components
const lazyLoad = (importFn) => {
  return lazy(() => {
    return importFn().catch((error) => {
      console.error('Dynamic import error:', error);
      // Fallback to an error page or default component
      return import('../pages/maintenance/Maintenance');
    });
  });
};

// Route Types
export const RouteTypes = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  RESTRICTED: 'RESTRICTED'
};

// Define all route configurations
export const routeConfigurations = [
  // Auth Routes
  {
    path: '/',
    component: lazyLoad(() => import('../pages/auth/SignIn')),
    type: RouteTypes.PUBLIC,
    name: 'Sign In'
  },
  {
    path: '/register',
    component: lazyLoad(() => import('../pages/auth/SIgnUp')),
    type: RouteTypes.PUBLIC,
    name: 'Sign Up'
  },
  {
    path: '/forget-password',
    component: lazyLoad(() => import('../pages/auth/ForgetPassword')),
    type: RouteTypes.PUBLIC,
    name: 'Forget Password'
  },
  
  // Dashboard Routes
  {
    path: '/home',
    component: lazyLoad(() => import('../pages/dashboard/Home')),
    type: RouteTypes.PRIVATE,
    name: 'Dashboard'
  },

  // Profile Routes
  {
    path: '/profile',
    component: lazyLoad(() => import('../pages/profile/Profile')),
    type: RouteTypes.PRIVATE,
    name: 'Profile'
  },
  {
    path: '/change-password',
    component: lazyLoad(() => import('../pages/profile/ChangePassword')),
    type: RouteTypes.PRIVATE,
    name: 'Change Password'
  },

  // Master Routes
  {
    path: '/master/company-list',
    component: lazyLoad(() => import('../pages/master/company/CompanyList')),
    type: RouteTypes.PRIVATE,
    name: 'Company Master',
    permissions: ['ADMIN', 'MANAGER','USER']
  },
  {
    path: '/master-branch-list',
    component: lazyLoad(() => import('../pages/master/branch/BranchList')),
    type: RouteTypes.PRIVATE,
    name: 'Branch Master',
    permissions: ['ADMIN', 'MANAGER','USER']
  },
  // Add more master routes...

  // Vehicles Routes
//   {
//     path: '/vehicles',
//     component: lazyLoad(() => import('./pages/vehicles/VehiclesList')),
//     type: RouteTypes.PRIVATE,
//     name: 'Vehicles',
//     permissions: ['ADMIN', 'FLEET_MANAGER']
//   },

//   // Tyre Routes
//   {
//     path: '/tyre/purchase',
//     component: lazyLoad(() => import('./pages/tyre/TyrePurchaseList')),
//     type: RouteTypes.PRIVATE,
//     name: 'Tyre Purchase',
//     permissions: ['ADMIN', 'PURCHASE_MANAGER']
//   },
  // Add more tyre routes...

  // Catch-all route
  {
    path: '*',
    component: lazyLoad(() => import('../pages/maintenance/Maintenance')),
    type: RouteTypes.PUBLIC,
    name: 'Not Found'
  }
];



