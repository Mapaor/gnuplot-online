'use client';

import React, { useState } from 'react';
import { GnuplotExample } from '@/data/examples';
import GnuplotHeader from './GnuplotHeader';
import ExampleGallery from './ExampleGallery';
import EditorTabs from './EditorTabs';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import DebugConsole from './DebugConsole';
import useDebugLog from '@/hooks/useDebugLog';
import useGnuplotModule from '@/hooks/useGnuplotModule';
import useCodeEditor from '@/hooks/useCodeEditor';
import usePlotGeneration from '@/hooks/usePlotGeneration';

const RefactoredGnuplotDemo: React.FC = () => {
  // State for showing the example gallery
  const [showGallery, setShowGallery] = useState(false);
  
  // Custom hooks
  const { debugMessages, addDebug, clearDebug } = useDebugLog();
  const gnuplotModule = useGnuplotModule(addDebug);
  const {
    plotCode,
    setPlotCode,
    dataContent,
    setDataContent,
    activeTab,
    setActiveTab,
    selectedExample,
    loadExample
  } = useCodeEditor();
  
  const { svgOutput, loading, generatePlot } = usePlotGeneration(
    gnuplotModule,
    plotCode,
    dataContent,
    addDebug
  );

  // Handler for loading examples
  const handleLoadExample = (example: GnuplotExample) => {
    loadExample(example, addDebug, () => {
      if (gnuplotModule) {
        generatePlot();
      }
    });
    setShowGallery(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <GnuplotHeader />

        {/* Example Gallery Toggle and Gallery */}
        <ExampleGallery
          showGallery={showGallery}
          setShowGallery={setShowGallery}
          loadExample={handleLoadExample}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-lg">
            <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-4">
              <CodeEditor
                activeTab={activeTab}
                plotCode={plotCode}
                dataContent={dataContent}
                setPlotCode={setPlotCode}
                setDataContent={setDataContent}
                selectedExample={selectedExample}
              />
            </div>
          </div>

          {/* Output Panel */}
          <OutputPanel
            svgOutput={svgOutput}
            loading={loading}
            gnuplotModule={gnuplotModule}
          />
        </div>

        {/* Debug Console */}
        <DebugConsole debugMessages={debugMessages} clearDebug={clearDebug} />

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            <a href="https://github.com/Mapaor/gnuplot-online" target='blank' className='underline'>gnuplot-online</a>: WebAssembly, Next.js, React i Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RefactoredGnuplotDemo;
