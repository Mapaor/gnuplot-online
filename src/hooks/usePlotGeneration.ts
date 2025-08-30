import { useState, useCallback } from 'react';
import { GnuplotModule } from '@/lib/gnuplot-loader';

interface UsePlotGenerationProps {
  gnuplotModule: GnuplotModule | null;
  addDebug: (message: string) => void;
}

interface PlotState {
  svgContent: string;
  isLoading: boolean;
  hasError: boolean;
}

export function usePlotGeneration({ gnuplotModule, addDebug }: UsePlotGenerationProps) {
  const [plotState, setPlotState] = useState<PlotState>({
    svgContent: '',
    isLoading: false,
    hasError: false,
  });

  const generatePlot = useCallback(async (code: string, data?: string) => {
    if (!gnuplotModule) {
      addDebug('Gnuplot module not initialized');
      return;
    }

    setPlotState(prev => ({ ...prev, isLoading: true, hasError: false }));

    try {
      addDebug('Generating plot...');
      
      // Clear any existing data and create temporary file for gnuplot code
      const gnuplotCode = `
        set terminal svg enhanced mouse standalone size 640,480
        set output "/tmp/output.svg"
        ${code}
      `;
      
      // Write gnuplot code to virtual filesystem
      gnuplotModule.FS.writeFile('/tmp/script.gp', gnuplotCode);
      addDebug('Gnuplot script written to virtual filesystem');
      
      // If data is provided, write it to a data file
      if (data) {
        gnuplotModule.FS.writeFile('/tmp/data.dat', data);
        addDebug('Data file written to virtual filesystem');
      }
      
      // Run gnuplot with the script
      gnuplotModule.callMain(['/tmp/script.gp']);
      addDebug('Gnuplot execution completed');
      
      // Read the generated SVG
      const svgContent = gnuplotModule.FS.readFile('/tmp/output.svg', { encoding: 'utf8' });
      addDebug('SVG output read from virtual filesystem');
      
      setPlotState({
        svgContent,
        isLoading: false,
        hasError: false,
      });
      
      // Clean up temporary files
      try {
        // Check if unlink method exists on FS
        if (typeof gnuplotModule.FS.unlink === 'function') {
          gnuplotModule.FS.unlink('/tmp/script.gp');
          if (data) gnuplotModule.FS.unlink('/tmp/data.dat');
          gnuplotModule.FS.unlink('/tmp/output.svg');
          addDebug('Temporary files cleaned up');
        } else {
          addDebug('FS.unlink method not available, skipping cleanup');
        }
      } catch (cleanupErr) {
        addDebug(`Warning: Error during cleanup: ${cleanupErr}`);
      }
    } catch (err) {
      addDebug(`Error generating plot: ${err}`);
      console.error('Error generating plot:', err);
      setPlotState({
        svgContent: '',
        isLoading: false,
        hasError: true,
      });
    }
  }, [gnuplotModule, addDebug]);

  return {
    ...plotState,
    generatePlot,
  };
}
