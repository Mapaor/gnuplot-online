import { useState, useEffect } from 'react';
import { loadGnuplotModule, GnuplotModule } from '@/lib/gnuplot-loader';

export const useGnuplotModule = (addDebug: (message: string) => void) => {
  const [gnuplotModule, setGnuplotModule] = useState<GnuplotModule | null>(null);

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

  return gnuplotModule;
};

export default useGnuplotModule;
