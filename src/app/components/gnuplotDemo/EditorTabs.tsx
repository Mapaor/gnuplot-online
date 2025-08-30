'use client';

import React from 'react';
import { InputTab } from '@/hooks/useCodeEditor';

interface EditorTabsProps {
  activeTab: InputTab;
  setActiveTab: (tab: InputTab) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default EditorTabs;
