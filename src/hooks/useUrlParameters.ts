import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { InputTab } from './useCodeEditor';

// Type for our URL parameters
export interface GnuplotUrlParams {
  code?: string;
  data?: string;
  tab?: InputTab;
}

/**
 * Hook to manage URL parameters for the Gnuplot editor
 */
export const useUrlParameters = (
  plotCode: string,
  dataContent: string,
  activeTab: InputTab,
  setPlotCode: (code: string) => void,
  setDataContent: (data: string) => void,
  setActiveTab: (tab: InputTab) => void,
) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract parameters from URL and update the editor on initial load
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const encodedCode = searchParams.get('code');
    const encodedData = searchParams.get('data');
    const tab = searchParams.get('tab') as InputTab | null;

    if (encodedCode) {
      try {
        const decodedCode = decodeURIComponent(encodedCode);
        setPlotCode(decodedCode);
      } catch (error) {
        console.error('Error decoding plot code from URL:', error);
      }
    }

    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        setDataContent(decodedData);
      } catch (error) {
        console.error('Error decoding data content from URL:', error);
      }
    }

    if (tab && (tab === 'code' || tab === 'data')) {
      setActiveTab(tab);
    }
  }, [searchParams, setPlotCode, setDataContent, setActiveTab]);

  // Function to update URL with current editor state
  const updateUrl = (params: GnuplotUrlParams) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const newParams = new URLSearchParams();
    
    if (params.code) {
      newParams.set('code', encodeURIComponent(params.code));
    }
    
    if (params.data) {
      newParams.set('data', encodeURIComponent(params.data));
    }
    
    if (params.tab) {
      newParams.set('tab', params.tab);
    }
    
    const newUrl = `${pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Function to share current plot state
  const getShareableUrl = (): string => {
    // Only run on client side
    if (typeof window === 'undefined') return '';
    
    const params = new URLSearchParams();
    params.set('code', encodeURIComponent(plotCode));
    params.set('data', encodeURIComponent(dataContent));
    params.set('tab', activeTab);
    
    // Get the base URL (works in browsers)
    const baseUrl = window.location.origin + pathname;
    return `${baseUrl}?${params.toString()}`;
  };

  return {
    updateUrl,
    getShareableUrl,
  };
};

export default useUrlParameters;
