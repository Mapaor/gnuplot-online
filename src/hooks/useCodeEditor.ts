import { useState, useCallback } from 'react';
import { GnuplotExample } from '@/data/examples';

interface UseCodeEditorProps {
  addDebug: (message: string) => void;
}

interface CodeEditorState {
  code: string;
  data: string;
  activeTab: 'code' | 'data';
}

export function useCodeEditor({ addDebug }: UseCodeEditorProps) {
  const [editorState, setEditorState] = useState<CodeEditorState>({
    code: '',
    data: '',
    activeTab: 'code',
  });

  const setCode = useCallback((newCode: string) => {
    setEditorState(prev => ({ ...prev, code: newCode }));
  }, []);

  const setData = useCallback((newData: string) => {
    setEditorState(prev => ({ ...prev, data: newData }));
  }, []);

  const setActiveTab = useCallback((tab: 'code' | 'data') => {
    setEditorState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const loadExample = useCallback((example: GnuplotExample) => {
    addDebug(`Loading example: ${example.title}`);
    setEditorState(prev => ({
      ...prev,
      code: example.code,
      data: example.data || '',
      // If example has data, switch to code tab regardless of current tab
      activeTab: prev.activeTab,
    }));
  }, [addDebug]);

  return {
    ...editorState,
    setCode,
    setData,
    setActiveTab,
    loadExample,
  };
}
