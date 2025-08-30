'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { gnuplotExamples, categories, GnuplotExample } from '@/data/examples';

interface ExampleGalleryProps {
  showGallery: boolean;
  setShowGallery: (show: boolean) => void;
  loadExample: (example: GnuplotExample) => void;
}

const ExampleGallery: React.FC<ExampleGalleryProps> = ({ 
  showGallery, 
  setShowGallery, 
  loadExample 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const filteredExamples = selectedCategory === 'All' 
    ? gnuplotExamples 
    : gnuplotExamples.filter((ex: GnuplotExample) => ex.category === selectedCategory);

  return (
    <>
      {/* Example gallery show button */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">            
          <div className="flex gap-3">
            <button
              onClick={() => setShowGallery(!showGallery)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              {showGallery ? '✕ Amaga la galeria' : (
                <span className="inline-flex items-center gap-1">
                  <Image 
                    src="https://cdn.jsdelivr.net/gh/mapaor/tw-emojis/tw-emojis-svgs/1f5c2.svg" 
                    alt="Showcase" 
                    width={20} 
                    height={20} 
                    className="inline-block align-middle mr-1" 
                  />
                  Exemples de la galeria
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Gallery */}
      {showGallery && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-2xl font-bold text-gray-800">Galeria d&apos;exemples</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            >
              <option value="All">Totes les categories ({gnuplotExamples.length})</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat} ({gnuplotExamples.filter((ex: GnuplotExample) => ex.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExamples.map((example: GnuplotExample) => (
              <div
                key={example.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                onClick={() => loadExample(example)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {example.title}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {example.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Clica per carregar l&apos;exemple
                  </div>
                  {example.data && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Inclou dades
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ExampleGallery;
