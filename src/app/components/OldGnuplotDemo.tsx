"use client";
import React, { useState, useEffect } from 'react';
import { loadGnuplotModule, type GnuplotModule } from '../../lib/gnuplot-loader';

export default function GnuplotDemo() {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [gnuplotCode, setGnuplotCode] = useState(`set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title 'Simple Plot Demo'
set key left top
set samples 500,500
plot [-10:10] sin(x) title 'sin(x)', cos(x) title 'cos(x)'`);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [gnuplotModule, setGnuplotModule] = useState<GnuplotModule | null>(null);

  const addDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load gnuplot module once on component mount
  useEffect(() => {
    async function initGnuplot() {
      try {
        addDebug('Component mounted, starting gnuplot initialization...');
        addDebug('Starting to load gnuplot module...');
        
        const GnuplotModuleLoader = await loadGnuplotModule();
        addDebug('Module loader obtained, initializing WASM...');
        
        const gnuplotWasmModule = await GnuplotModuleLoader({
          locateFile: (path: string) => {
            addDebug(`Locating file: ${path}`);
            if (path.endsWith('.wasm')) {
              return '/gnuplot.wasm';
            }
            return path;
          },
          // Disable interactive input to prevent prompts
          noInitialRun: true,
          // Provide empty stdin
          stdin: () => null,
          // Disable prompts
          prompt: () => null,
          // Handle print and printErr
          print: (text: string) => {
            addDebug(`Gnuplot output: ${text}`);
          },
          printErr: (text: string) => {
            addDebug(`Gnuplot error: ${text}`);
          }
        });
        
        addDebug('Gnuplot module initialized successfully!');
        setGnuplotModule(gnuplotWasmModule);
      } catch (err) {
        addDebug(`Error loading gnuplot: ${err}`);
        console.error('Error loading gnuplot:', err);
        
        // Try a different approach if the first one fails
        addDebug('Attempting alternative loading method...');
        try {
          // Direct approach - load the script and try to access it differently
          const script = document.createElement('script');
          script.src = '/gnuplot.js';
          script.type = 'module';
          document.head.appendChild(script);
          
          addDebug('Script added to head, waiting for load...');
          
          // Wait and then try to access the module
          setTimeout(async () => {
            try {
              addDebug('Checking browser console and DOM for any available modules...');
              
              // Check if the script is actually accessible at the URL
              const response = await fetch('/gnuplot.js');
              if (response.ok) {
                addDebug('gnuplot.js is accessible via fetch');
                const content = await response.text();
                addDebug(`Script content length: ${content.length} characters`);
              } else {
                addDebug(`Failed to fetch gnuplot.js: ${response.status} ${response.statusText}`);
              }
            } catch (fetchErr) {
              addDebug(`Fetch error: ${fetchErr}`);
            }
          }, 2000);
          
        } catch (altErr) {
          addDebug(`Alternative loading also failed: ${altErr}`);
        }
      }
    }

    initGnuplot();
  }, []);

  async function generatePlot() {
    if (!gnuplotModule) {
      addDebug('Gnuplot module not loaded yet');
      return;
    }

    setLoading(true);
    setSvgContent('');
    
    try {
      addDebug('Starting plot generation...');
      
      // Write the script to the virtual FS and execute
      addDebug('Writing gnuplot script to virtual FS...');
      gnuplotModule.FS.writeFile('script.gnuplot', gnuplotCode);
      
      addDebug('Executing gnuplot...');
      const exitCode = gnuplotModule.callMain(['script.gnuplot']);
      addDebug(`Gnuplot execution completed with exit code: ${exitCode}`);
      
      addDebug('Reading SVG output...');
      const svg = gnuplotModule.FS.readFile('plot.svg', { encoding: 'utf8' });
      addDebug(`SVG content length: ${svg.length} characters`);
      
      setSvgContent(svg);
      addDebug('Plot generated successfully!');
    } catch (err) {
      addDebug(`Error generating plot: ${err}`);
      console.error('Error generating plot:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Demo Gnuplot-WASM amb React i Tailwind</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gnuplot Code</h2>
          <textarea
            value={gnuplotCode}
            onChange={(e) => setGnuplotCode(e.target.value)}
            className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
            placeholder="Enter your gnuplot code here..."
          />
          
          <button
            onClick={generatePlot}
            disabled={loading || !gnuplotModule}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Run Gnuplot'}
          </button>
          
          {!gnuplotModule && (
            <p className="text-orange-600">Loading gnuplot module...</p>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Output</h2>
          
          {loading ? (
            <p className="text-blue-600">Generant gràfic...</p>
          ) : svgContent ? (
            <div className="border rounded p-2 bg-gray-50 overflow-auto max-h-96">
              <div dangerouslySetInnerHTML={{ __html: svgContent }} />
            </div>
          ) : (
            <p className="text-gray-500">No plot generated yet. Click &quot;Run Gnuplot&quot; to generate.</p>
          )}
        </div>
      </div>

      {/* Debug Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <div className="bg-black text-green-400 p-3 rounded-lg h-48 overflow-y-auto font-mono text-xs">
          {debugInfo.length === 0 ? (
            <p>No debug information yet...</p>
          ) : (
            debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))
          )}
        </div>
        <button
          onClick={() => setDebugInfo([])}
          className="mt-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Debug
        </button>
      </div>
    </div>
  );
}
