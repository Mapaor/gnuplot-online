import { useState, useCallback, useEffect } from 'react';
import { GnuplotModule } from '@/lib/gnuplot-loader';

export const usePlotGeneration = (
  gnuplotModule: GnuplotModule | null,
  plotCode: string,
  dataContent: string,
  addDebug: (message: string) => void
) => {
  const [svgOutput, setSvgOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  // Auto-generate plot when gnuplotModule loads or plotCode/dataContent changes
  useEffect(() => {
    if (gnuplotModule && plotCode.trim()) {
      const timeoutId = setTimeout(() => {
        generatePlot();
      }, 500); // Small delay to avoid rapid re-generation
      
      return () => clearTimeout(timeoutId);
    }
  }, [gnuplotModule, plotCode, dataContent, generatePlot]);

  return {
    svgOutput,
    loading,
    generatePlot
  };
};

export default usePlotGeneration;
