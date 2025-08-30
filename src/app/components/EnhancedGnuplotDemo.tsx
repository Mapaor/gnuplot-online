'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadGnuplotModule, GnuplotModule } from '@/lib/gnuplot-loader';
import { gnuplotExamples, categories, GnuplotExample } from '@/data/examples';

interface DebugMessage {
  timestamp: string;
  message: string;
}

export default function GnuplotDemo() {
  const [gnuplotModule, setGnuplotModule] = useState<GnuplotModule | null>(null);
  const [loading, setLoading] = useState(false);
  const [plotCode, setPlotCode] = useState(`set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title 'Welcome to Gnuplot Web Compiler!'
set xlabel 'x'
set ylabel 'y'
set grid
set key left top
set samples 500
plot [-10:10] sin(x) title 'sin(x)', cos(x) title 'cos(x)', sin(x)/x title 'sinc(x)'`);
  const [svgOutput, setSvgOutput] = useState<string>('');
  const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExample, setSelectedExample] = useState<GnuplotExample | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const addDebug = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugMessages(prev => [...prev, { timestamp, message }]);
  }, []);

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
      }
    }

    initGnuplot();
  }, [addDebug]);

  const generatePlot = useCallback(async () => {
    if (!gnuplotModule) {
      addDebug('Gnuplot module not loaded yet');
      return;
    }

    setLoading(true);
    addDebug('Starting plot generation...');

    try {
      // Clear any existing output file first
      try {
        if (gnuplotModule.FS.unlink) {
          gnuplotModule.FS.unlink('plot.svg');
          addDebug('Cleared previous plot.svg file');
        }
      } catch {
        // File doesn't exist, which is fine
        addDebug('No previous plot.svg file to clear');
      }

      // Write the gnuplot script to a file
      gnuplotModule.FS.writeFile('script.gnuplot', plotCode);
      addDebug('Gnuplot script written to virtual filesystem');
      addDebug(`Script content: ${plotCode.substring(0, 100)}...`);

      // Execute gnuplot
      const result = gnuplotModule.callMain(['script.gnuplot']);
      addDebug(`Gnuplot execution completed with result: ${result}`);

      // List files to see what was created
      try {
        if (gnuplotModule.FS.readdir) {
          const files = gnuplotModule.FS.readdir('/');
          addDebug(`Files in root directory: ${files.join(', ')}`);
        }
      } catch {
        addDebug('Could not list files in root directory');
      }

      // Read the SVG output
      try {
        const svgContent = gnuplotModule.FS.readFile('plot.svg', { encoding: 'utf8' });
        if (svgContent && svgContent.length > 0) {
          setSvgOutput(svgContent);
          addDebug(`SVG output read successfully (${svgContent.length} characters)`);
          addDebug(`SVG preview: ${svgContent.substring(0, 200)}...`);
        } else {
          addDebug('SVG file exists but is empty');
          setSvgOutput('<svg width="400" height="300"><text x="50" y="150" fill="orange">Generated SVG file is empty</text></svg>');
        }
      } catch (readErr) {
        addDebug(`Could not read SVG output: ${readErr}`);
        setSvgOutput('<svg width="400" height="300"><text x="50" y="150" fill="red">Error reading plot output</text></svg>');
      }
    } catch (err) {
      addDebug(`Error generating plot: ${err}`);
      console.error('Error generating plot:', err);
      setSvgOutput('<svg width="400" height="300"><text x="50" y="150" fill="red">Plot generation failed</text></svg>');
    } finally {
      setLoading(false);
    }
  }, [gnuplotModule, plotCode, addDebug]);

  const loadExample = (example: GnuplotExample) => {
    setPlotCode(example.code);
    setSelectedExample(example);
    setShowGallery(false);
    addDebug(`Loaded example: ${example.title}`);
    // Auto-generate plot after loading example
    setTimeout(() => {
      if (gnuplotModule) {
        generatePlot();
      }
    }, 100);
  };

  // Auto-generate plot when gnuplotModule loads or plotCode changes
  useEffect(() => {
    if (gnuplotModule && plotCode.trim()) {
      const timeoutId = setTimeout(() => {
        generatePlot();
      }, 500); // Small delay to avoid rapid re-generation
      
      return () => clearTimeout(timeoutId);
    }
  }, [gnuplotModule, plotCode, generatePlot]);

  const clearDebug = () => {
    setDebugMessages([]);
  };

  const filteredExamples = selectedCategory === 'All' 
    ? gnuplotExamples 
    : gnuplotExamples.filter(ex => ex.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gnuplot Web Compiler
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Create beautiful plots and visualizations with Gnuplot in your browser
          </p>
          <p className="text-sm text-gray-500">
            Powered by WebAssembly • No installation required • Real-time plotting
          </p>
        </header>

        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${gnuplotModule ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="text-sm font-medium">
                  {gnuplotModule ? 'Gnuplot Ready • Auto-generating plots' : 'Loading Gnuplot...'}
                </span>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Generating plot...</span>
                </div>
              )}
              {selectedExample && (
                <div className="text-sm text-gray-600">
                  Current: <span className="font-medium text-blue-600">{selectedExample.title}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowGallery(!showGallery)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {showGallery ? '✕ Hide Gallery' : '🎨 Show Examples'}
              </button>
            </div>
          </div>
        </div>

        {/* Example Gallery */}
        {showGallery && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">📊 Example Gallery</h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
              >
                <option value="All">All Categories ({gnuplotExamples.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat} ({gnuplotExamples.filter(ex => ex.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExamples.map(example => (
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
                  <div className="text-xs text-gray-500">
                    Click to load this example
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                📝 Gnuplot Script
              </h2>
              {selectedExample && (
                <p className="text-sm text-gray-600 mt-1">
                  Editing: <span className="font-medium text-blue-600">{selectedExample.title}</span>
                  <span className="text-gray-400 ml-2">({selectedExample.category})</span>
                </p>
              )}
            </div>
            <div className="p-4">
              <textarea
                value={plotCode}
                onChange={(e) => setPlotCode(e.target.value)}
                className="w-full h-80 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter your Gnuplot script here..."
                spellCheck={false}
              />
              <div className="mt-3 text-xs text-gray-500">
                💡 Tip: Use &apos;set terminal svg&apos; and &apos;set output&apos; for best results • Plots generate automatically as you type
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                📈 Plot Output
              </h2>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg h-80 overflow-auto bg-gray-50 flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Generating plot...</p>
                  </div>
                ) : svgOutput ? (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>{gnuplotModule ? 'Edit the script to generate your plot automatically' : 'Loading Gnuplot module...'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Debug Console */}
        <div className="mt-6 bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                🔧 Debug Console
              </h2>
              <button
                onClick={clearDebug}
                className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs">
              {debugMessages.length === 0 ? (
                <div className="text-gray-500">Debug messages will appear here...</div>
              ) : (
                debugMessages.map((msg, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-blue-400">[{msg.timestamp}]</span> {msg.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ using Gnuplot WebAssembly, Next.js, React, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
