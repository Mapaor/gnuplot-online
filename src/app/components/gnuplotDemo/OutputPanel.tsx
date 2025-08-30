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
        <div 
          className="border border-gray-300 rounded-lg min-h-[20rem] max-h-[28rem] bg-gray-50 flex items-center justify-center overflow-y-auto relative group"
        >
          {/* Download button */}
          {svgOutput && !loading && (
            <>
              {/* Desktop button - only shown on hover on larger screens */}
              <button 
                onClick={() => {
                  const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'gnuplot-output.svg';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className={`absolute top-2 right-2 bg-gray-700 text-white p-1.5 rounded-md shadow-sm z-10 items-center transition-opacity ease-in-out duration-300 cursor-pointer
                  hidden md:flex md:opacity-0 group-hover:opacity-60 hover:opacity-80`}
                title="Download SVG"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              
              {/* Mobile button - always shown on small screens */}
              <button 
                onClick={() => {
                  const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'gnuplot-output.svg';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="absolute top-2 right-2 bg-gray-700 text-white p-1.5 rounded-md shadow-sm z-10 flex items-center opacity-60 hover:opacity-80 transition-all ease-in-out duration-200 cursor-pointer md:hidden"
                title="Download SVG"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </>
          )}
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
