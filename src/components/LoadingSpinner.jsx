


import React from 'react';
import Layout from '../layout/Layout';

const LoadingSpinner = () => {
  return (
    <Layout>
      <div className="w-full bg-white  mx-auto p-4 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        {/* Main content area */}
        <div className="h-52 bg-gray-200 rounded animate-pulse" />
        
        {/* Text lines */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-10/12" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-9/12" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex space-x-2">
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    </Layout>
  );
};

export default LoadingSpinner;