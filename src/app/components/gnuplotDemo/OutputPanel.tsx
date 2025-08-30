'use client';

import React from 'react';
import { GnuplotModule } from '@/lib/gnuplot-loader';

interface OutputPanelProps {
  svgOutput: string;
  loading: boolean;
  gnuplotModule: GnuplotModule | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
  svgOutput, 
  loading, 
  gnuplotModule 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-gray-800">Plot</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${gnuplotModule ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
            <span className="text-sm font-medium">
              {gnuplotModule ? 'Gnuplot' : 'Gnuplot...'}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="border border-gray-300 rounded-lg min-h-[20rem] max-h-[28rem] bg-gray-50 flex items-center justify-center overflow-y-auto">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Generating plot...</p>
            </div>
          ) : svgOutput ? (
            <div className="w-full h-full flex items-center justify-center">
              {/* Responsive SVG rendering: inject a wrapper and style the SVG */}
              <div
                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                ref={el => {
                  if (el && svgOutput) {
                    el.innerHTML = svgOutput;
                    const svg = el.querySelector('svg');
                    if (svg) {
                      svg.style.width = '100%';
                      svg.style.height = '100%';
                      svg.style.maxHeight = '27rem';
                      svg.style.objectFit = 'contain';
                      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2"></div>
              <p>{gnuplotModule ? 'Edit the script to generate your plot automatically' : 'Loading Gnuplot module...'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
