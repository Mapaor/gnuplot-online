'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import CodeMirror from '@uiw/react-codemirror';
import { loadGnuplotModule, GnuplotModule } from '@/lib/gnuplot-loader';
import { gnuplotExamples, categories, GnuplotExample } from '@/data/examples';
import { gnuplotLanguage } from '@/lib/gnuplot-language';
import { dataLanguage } from '@/lib/data-language';
import { gnuplotEditorTheme } from '@/lib/gnuplot-theme';

type InputTab = 'code' | 'data';

interface DebugMessage {
  timestamp: string;
  message: string;
}

export default function GnuplotDemo() {
  const [gnuplotModule, setGnuplotModule] = useState<GnuplotModule | null>(null);
  const [loading, setLoading] = useState(false);
  const [plotCode, setPlotCode] = useState(`set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title 'Hola Física UB :)'
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
  const [activeTab, setActiveTab] = useState<InputTab>('code');
  const [dataContent, setDataContent] = useState<string>(`# Fitxer de dades buit`);

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

      // Write the data content to a file
      gnuplotModule.FS.writeFile('data.dat', dataContent);
      addDebug('Data content written to data.dat in virtual filesystem');

      // Write the gnuplot script to a file
      gnuplotModule.FS.writeFile('script.gnuplot', plotCode);
      addDebug('Gnuplot script written to virtual filesystem');
      addDebug(`Script content: ${plotCode.substring(0, 100)}...`);

      // Execute gnuplot with error handling
      let result: number;
      try {
        result = gnuplotModule.callMain(['script.gnuplot']);
        addDebug(`Gnuplot execution completed with result: ${result}`);
      } catch (execErr) {
        addDebug(`Gnuplot execution error: ${execErr}`);
        throw new Error(`Gnuplot execution failed: ${execErr}`);
      }

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

      // Clean up temporary files
      try {
        if (gnuplotModule.FS.unlink) {
          gnuplotModule.FS.unlink('script.gnuplot');
          addDebug('Cleaned up script.gnuplot file');
          gnuplotModule.FS.unlink('data.dat');
          addDebug('Cleaned up data.dat file');
        }
      } catch {
        // File cleanup is optional
        addDebug('Could not clean up temporary files (not critical)');
      }
    } catch (err) {
      addDebug(`Error generating plot: ${err}`);
      console.error('Error generating plot:', err);
      setSvgOutput('<svg width="400" height="300"><text x="50" y="150" fill="red">Plot generation failed</text></svg>');
    } finally {
      setLoading(false);
    }
  }, [gnuplotModule, plotCode, dataContent, addDebug]);

  const loadExample = (example: GnuplotExample) => {
    setPlotCode(example.code);
    // Set data content if available, otherwise keep current data
    if (example.data) {
      setDataContent(example.data);
      addDebug(`Loaded data for example: ${example.title}`);
    }
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

  // Auto-generate plot when gnuplotModule loads or plotCode/dataContent changes
  useEffect(() => {
    if (gnuplotModule && plotCode.trim()) {
      const timeoutId = setTimeout(() => {
        generatePlot();
      }, 500); // Small delay to avoid rapid re-generation
      
      return () => clearTimeout(timeoutId);
    }
  }, [gnuplotModule, plotCode, dataContent, generatePlot]);

  const clearDebug = () => {
    setDebugMessages([]);
  };

  const filteredExamples = selectedCategory === 'All' 
    ? gnuplotExamples 
    : gnuplotExamples.filter((ex: GnuplotExample) => ex.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
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

        {/*Example gallery show button*/}
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

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  Input
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'code'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Codi
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'data'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Dades
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              {activeTab === 'code' ? (
                <>
                  <CodeMirror
                    value={plotCode}
                    onChange={(value) => setPlotCode(value)}
                    extensions={[gnuplotLanguage()]}
                    theme={gnuplotEditorTheme}
                    placeholder="Enter your Gnuplot script here..."
                    basicSetup={{
                      lineNumbers: false,
                      highlightActiveLine: true,
                      highlightActiveLineGutter: true,
                      foldGutter: false,
                      dropCursor: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true
                    }}
                  />
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="text-xs text-gray-500">
                      Nota: El &quot;set terminal svg&quot; i &quot;set output &apos;plot.svg&apos;&quot; s&apos;han de posar sempre.
                    </div>
                    {selectedExample?.data && (
                      <div className="text-xs text-green-600 italic">
                        * Aquest exemple utilitza dades externes. Pots veure-les a la pestanya &quot;Data&quot;.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <CodeMirror
                    value={dataContent}
                    onChange={(value) => setDataContent(value)}
                    extensions={[dataLanguage()]}
                    theme={gnuplotEditorTheme}
                    placeholder="Enter your data here..."
                    basicSetup={{
                      lineNumbers: false,
                      highlightActiveLine: true,
                      highlightActiveLineGutter: true,
                      foldGutter: false,
                      dropCursor: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: false
                    }}
                  />
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="text-xs text-gray-500">
                      Nota: Aquestes dades es guarden en un fitxer anomenat &quot;data.dat&quot; que pots utilitzar en el codi gnuplot amb <code className="bg-gray-100 px-1 rounded">plot &quot;data.dat&quot; using 1:2</code>
                    </div>
                    {selectedExample?.data && (
                      <div className="text-xs text-green-600 italic">
                        * Les dades actuals provenen de l&apos;exemple &quot;{selectedExample.title}&quot;
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Output Panel */}
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
        </div>

        {/* Debug Console */}
        <div className="mt-6 bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Logs del compilador
              </h2>
              <button
                onClick={clearDebug}
                className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
              >
                Esborrar
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg h-32 overflow-y-auto font-mono text-xs">
              {debugMessages.length === 0 ? (
                <div className="text-gray-500">Els missatges de debugging apareixaran aquí</div>
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
            <a href="https://github.com/Mapaor/gnuplot-online" target='blank' className='underline'>gnuplot-online</a>: WebAssembly, Next.js, React i Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
}
