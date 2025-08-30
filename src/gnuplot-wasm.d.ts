declare module 'gnuplot-wasm' {
  interface RenderResult {
    svg: string;
    // Add other properties if needed
  }

  interface GnuplotOptions {
    locateFile?: (path: string) => string;
  }

  function gnuplot(options?: GnuplotOptions): Promise<{
    render: (script: string) => Promise<RenderResult>;
  }>;

  export default gnuplot;
}
