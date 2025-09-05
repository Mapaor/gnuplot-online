import { useState } from 'react';
import { GnuplotExample } from '@/data/examples';

export type InputTab = 'code' | 'data';

export const useCodeEditor = () => {
  const [plotCode, setPlotCode] = useState(`set terminal svg enhanced size 800,600 font "Helvetica,16" background rgb "white"
set output 'plot.svg'

# Títol
set title "Hola! Pots editar aquest gràfic :)" font "Helvetica,22" tc rgb "black"

# Eixos simulats
set xrange [-1.75:10.75]
set yrange [-4.5:3.75]
# set xlabel "Online" font "Helvetica,16"
# set ylabel "Gnuplot" font "Helvetica,16"

# Graella i estètica
set grid lw 1 lc rgb "gray80"
set border lw 2 lc rgb "black"
set xtics font "Helvetica,14"
set ytics font "Helvetica,14"

# Ajust de proporció
set size ratio -1

# Llegenda desactivada
unset key

# Plotejar dades amb colors i punts grans
plot 'data.dat' using 1:2:3 with linespoints lw 3 pt 7 ps 0.6 lc variable notitle
`);
  
  const [dataContent, setDataContent] = useState<string>(`# x  y  grup
# F
0 0  1
0 2  1
1 2  1

0 1  1
1 1  1

# I
2 0  2
2 1  2
2 2  2

# 2.1 2.5  2
# 3.0   2.8  2

# S
3 0  3
4 0  3
4 1  3
3 1  3
3 2  3
4 2  3

# I
5 0  4
5 1  4
5 2  4

# C
7 0  5
6 0  5
6 1  5
6 2  5
7 2  5

# A
8 0  6
8 1  6
8 2  6
9 2  6
9 1  6
8 1  6
9 1  6
9 0  6

# U
3.25 -1 7
3.25 -2 7
3.25 -3 7
4.25 -3 7
4.25 -2 7
4.25 -1 7


# B
5.25  -3  8
5.25  -1  8
6.25  -1  8
6.25  -2  8
5.25  -2  8
6.25  -2  8
6.25  -3  8
5.25  -3  8
`);
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
