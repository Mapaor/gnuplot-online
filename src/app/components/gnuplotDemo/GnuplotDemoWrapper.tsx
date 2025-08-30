'use client';

import React, { Suspense } from 'react';
import GnuplotDemo from './GnuplotDemo';

// Loading component for Suspense fallback
const GnuplotDemoLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Gnuplot Editor...</p>
      </div>
    </div>
  );
};

// Wrapper component with Suspense boundary
const GnuplotDemoWrapper: React.FC = () => {
  return (
    <Suspense fallback={<GnuplotDemoLoading />}>
      <GnuplotDemo />
    </Suspense>
  );
};

export default GnuplotDemoWrapper;
