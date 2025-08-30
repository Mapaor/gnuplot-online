'use client';

import React from 'react';

const GnuplotHeader: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
        Gnuplot Online
      </h1>
      <p className="text-xl text-gray-600 mb-2">
        Galeria d&apos;exemples de gràfics que es poden generar amb Gnuplot
      </p>
      <p className="text-sm text-gray-500">
        Fet amb WebAssembly, els exemples són editables, es grafica en temps real.
      </p>
    </header>
  );
};

export default GnuplotHeader;
