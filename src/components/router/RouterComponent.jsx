
// src/components/Router/RouterComponent.jsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';


import { Loader } from 'lucide-react';
import { routeConfigurations, RouteTypes } from '../../routes/routeConfig';
import PrivateRoute from './PrivateRoute';

const RouterComponent = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routeConfigurations.map((route) => {
          const RouteComponent = route.component;

          // Determine route wrapper based on type
          const renderRoute = () => {
            switch(route.type) {
              case RouteTypes.PRIVATE:
                return (
                  <Route 
                    key={route.path} 
                    element={<PrivateRoute allowedPermissions={route.permissions} />}
                  >
                    <Route 
                      path={route.path} 
                      element={<RouteComponent />} 
                    />
                  </Route>
                );
              
              case RouteTypes.RESTRICTED:
                // Add logic for restricted routes if needed
                return null;
              
              default:
                return (
                  <Route 
                    key={route.path} 
                    path={route.path} 
                    element={<RouteComponent />} 
                  />
                );
            }
          };

          return renderRoute();
        })}
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;