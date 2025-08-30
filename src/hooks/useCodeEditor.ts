import { useState } from 'react';
import { GnuplotExample } from '@/data/examples';

export type InputTab = 'code' | 'data';

export const useCodeEditor = () => {
  const [plotCode, setPlotCode] = useState(`set terminal svg enhanced size 800,600 background rgb 'white'
set output 'plot.svg'
set title 'Hola Física UB :)'
set xlabel 'x'
set ylabel 'y'
set grid
set key left top
set samples 500
plot [-10:10] sin(x) title 'sin(x)', cos(x) title 'cos(x)', sin(x)/x title 'sinc(x)'`);
  
  const [dataContent, setDataContent] = useState<string>(`# Fitxer de dades buit`);
  const [activeTab, setActiveTab] = useState<InputTab>('code');
  const [selectedExample, setSelectedExample] = useState<GnuplotExample | null>(null);

  const loadExample = async (example: GnuplotExample, addDebug: (message: string) => void, onLoad?: () => void) => {
    setPlotCode(example.code);
    
    // Set data content if available
    if (example.data) {
      setDataContent(example.data);
      addDebug(`Loaded inline data for example: ${example.title}`);
    } 
    // Load data from external file if specified
    else if (example.dataFile) {
      try {
        addDebug(`Loading external data file: ${example.dataFile}`);
        const response = await fetch(`/${example.dataFile}`);
        if (!response.ok) {
          throw new Error(`Failed to load data file: ${response.status} ${response.statusText}`);
        }
        const fileContent = await response.text();
        setDataContent(fileContent);
        addDebug(`Successfully loaded external data from ${example.dataFile}`);
      } catch (error) {
        addDebug(`Error loading data file: ${error}`);
        console.error('Error loading data file:', error);
        setDataContent(`# Error loading data file: ${example.dataFile}\n# ${error}`);
      }
    }
    
    setSelectedExample(example);
    addDebug(`Loaded example: ${example.title}`);
    
    // Call onLoad callback if provided
    if (onLoad) {
      setTimeout(onLoad, 100);
    }
  };

  return {
    plotCode,
    setPlotCode,
    dataContent,
    setDataContent,
    activeTab,
    setActiveTab,
    selectedExample,
    loadExample
  };
};

export default useCodeEditor;
