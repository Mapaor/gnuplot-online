import { useState, useCallback } from 'react';

export interface DebugMessage {
  timestamp: string;
  message: string;
}

export function useDebugLog() {
  const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([]);

  const addDebug = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugMessages(prev => [...prev, { timestamp, message }]);
  }, []);

  const clearDebug = useCallback(() => {
    setDebugMessages([]);
  }, []);

  return {
    debugMessages,
    addDebug,
    clearDebug
  };
}
