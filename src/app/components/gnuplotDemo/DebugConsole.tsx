'use client';

import React from 'react';
import { DebugMessage } from '@/hooks/useDebugLog';

interface DebugConsoleProps {
  debugMessages: DebugMessage[];
  clearDebug: () => void;
}

const DebugConsole: React.FC<DebugConsoleProps> = ({ debugMessages, clearDebug }) => {
  return (
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
  );
};

export default DebugConsole;
