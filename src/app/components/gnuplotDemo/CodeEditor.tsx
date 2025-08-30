'use client';

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { gnuplotLanguage } from '@/lib/gnuplot-language';
import { dataLanguage } from '@/lib/data-language';
import { gnuplotEditorTheme } from '@/lib/gnuplot-theme';
import { InputTab } from '@/hooks/useCodeEditor';
import { GnuplotExample } from '@/data/examples';

interface CodeEditorProps {
  activeTab: InputTab;
  plotCode: string;
  dataContent: string;
  setPlotCode: (value: string) => void;
  setDataContent: (value: string) => void;
  selectedExample: GnuplotExample | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  plotCode,
  dataContent,
  setPlotCode,
  setDataContent,
  selectedExample
}) => {
  return (
    <>
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
            {/* {selectedExample?.data && (
              <div className="text-xs text-green-600 italic">
                * Aquest exemple utilitza dades externes. Pots veure-les a la pestanya &quot;Data&quot;.
              </div>
            )} */}
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
              Nota: Aquestes dades es guarden en un fitxer anomenat &quot;data.dat&quot; que pots utilitzar en el codi gnuplot amb <code className="bg-gray-100 px-1 rounded">plot &quot;data.dat&quot;</code>.
            </div>
            {/* {selectedExample?.data && (
              <div className="text-xs text-green-600 italic">
                * Les dades actuals provenen de l&apos;exemple &quot;{selectedExample.title}&quot;
              </div>
            )} */}
          </div>
        </>
      )}
    </>
  );
};

export default CodeEditor;
