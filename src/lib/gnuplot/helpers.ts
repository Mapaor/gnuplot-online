/**
 * Helper functions for working with Gnuplot
 */

/**
 * Extracts data references from gnuplot code
 * Looks for patterns like 'using ... with ... title ...' and similar constructs
 * @param code The gnuplot code to analyze
 * @returns Boolean indicating if the code likely uses data files
 */
export function detectDataUsage(code: string): boolean {
  // Common patterns that indicate data usage
  const dataPatterns = [
    /plot\s+['"].*['"]\s/i,         // plot "filename" syntax
    /plot\s+.*using/i,              // plot ... using ... syntax
    /splot\s+['"].*['"]/i,          // splot "filename" syntax
    /splot\s+.*using/i,             // splot ... using ... syntax
    /load\s+['"].*['"]/i,           // load "filename" syntax
    /'\/tmp\/data\.dat'/,           // Our specific temporary data file
    /"\/tmp\/data\.dat"/,           // Our specific temporary data file (double quotes)
  ];

  // Check if any pattern matches
  return dataPatterns.some(pattern => pattern.test(code));
}

/**
 * Formats gnuplot code to ensure proper terminal and output settings
 * @param code The original gnuplot code
 * @returns Formatted gnuplot code
 */
export function formatGnuplotCode(code: string): string {
  // If code already has terminal and output settings, use them
  if (code.includes('set terminal') && code.includes('set output')) {
    return code;
  }

  // Otherwise, add SVG terminal and output settings
  return `
set terminal svg enhanced mouse standalone size 640,480
set output "/tmp/output.svg"
${code}`;
}
