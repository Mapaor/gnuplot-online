// Type definitions for gnuplot module
export interface GnuplotModule {
  FS: {
    writeFile: (name: string, content: string) => void;
    readFile: (name: string, opts: { encoding: string }) => string;
    unlink?: (path: string) => void;
    readdir?: (path: string) => string[];
  };
  callMain: (args: string[]) => number;
}

export interface ModuleOptions {
  locateFile?: (path: string) => string;
  noInitialRun?: boolean;
  stdin?: () => string | null;
  prompt?: () => string | null;
  print?: (text: string) => void;
  printErr?: (text: string) => void;
  arguments?: string[];
  preRun?: (() => void)[];
  postRun?: (() => void)[];
}

// Extend globalThis to include Module
declare global {
  var Module: ((options: ModuleOptions) => Promise<GnuplotModule>) | undefined;
  interface Window {
    Module?: ((options: ModuleOptions) => Promise<GnuplotModule>) | undefined;
  }
}

// Load gnuplot module function
export async function loadGnuplotModule(): Promise<(options: ModuleOptions) => Promise<GnuplotModule>> {
  console.log('🔧 Starting to load gnuplot module...');
  
  // Skip dynamic import approach for now since it causes build-time issues
  // Go directly to the runtime script injection approach
  console.log('🔧 Using script injection approach...');
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    
    // Create a unique global variable name to avoid conflicts
    const globalVarName = '_GnuplotModule_' + Date.now();
    
    script.textContent = `
      import Module from '/gnuplot.js';
      console.log('🔧 Script loaded Module:', Module);
      console.log('🔧 Module type:', typeof Module);
      
      // Ensure we don't accidentally set any deprecated properties
      if (typeof Module === 'function') {
        window.${globalVarName} = Module;
        window.dispatchEvent(new CustomEvent('${globalVarName}_ready'));
      } else {
        console.error('🔧 Loaded module is not a function:', Module);
        window.dispatchEvent(new CustomEvent('${globalVarName}_error'));
      }
    `;
    
    // Listen for the ready event
    const handleReady = () => {
      console.log('🔧 Module ready event received');
      const loadedModule = (window as unknown as Record<string, unknown>)[globalVarName];
      
      if (loadedModule) {
        console.log('🔧 Module retrieved from global variable:', typeof loadedModule);
        // Clean up
        delete (window as unknown as Record<string, unknown>)[globalVarName];
        document.head.removeChild(script);
        resolve(loadedModule as (options: ModuleOptions) => Promise<GnuplotModule>);
      } else {
        reject(new Error('Module not found in global variable'));
      }
    };

    const handleError = () => {
      console.log('🔧 Module error event received');
      reject(new Error('Module failed to load properly'));
    };

    window.addEventListener(`${globalVarName}_ready`, handleReady, { once: true });
    window.addEventListener(`${globalVarName}_error`, handleError, { once: true });    // Set timeout
    setTimeout(() => {
      window.removeEventListener(`${globalVarName}_ready`, handleReady);
      window.removeEventListener(`${globalVarName}_error`, handleError);
      reject(new Error('Timeout waiting for module to load'));
    }, 10000);
    
    script.onerror = (error) => {
      console.log('🔧 Script error:', error);
      reject(new Error('Script execution failed'));
    };
    
    console.log('🔧 Adding script to document head...');
    document.head.appendChild(script);
  });
}
