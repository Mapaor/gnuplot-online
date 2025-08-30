import { LanguageSupport, StreamLanguage } from '@codemirror/language';

// Define the Gnuplot language for CodeMirror
export function gnuplot() {
  return StreamLanguage.define({
    token(stream) {
      // Handle comments
      if (stream.match('#')) {
        stream.skipToEnd();
        return 'comment';
      }

      // Handle strings
      if (stream.match(/'[^']*'/) || stream.match(/"[^"]*"/)) {
        return 'string';
      }

      // Handle numbers
      if (stream.match(/^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/) || 
          stream.match(/^\.[0-9]+([eE][+-]?[0-9]+)?/)) {
        return 'number';
      }

      // Handle Gnuplot keywords
      const keywords = [
        'set', 'unset', 'reset', 'plot', 'splot', 'replot', 'using', 'with',
        'title', 'xlabel', 'ylabel', 'zlabel', 'xrange', 'yrange', 'zrange',
        'terminal', 'output', 'style', 'function', 'if', 'else', 'do', 'while',
        'for', 'print', 'fit', 'call', 'cd', 'clear', 'exit', 'help', 'history',
        'load', 'pause', 'quit', 'reread', 'save', 'system', 'test', 'update',
        'multiplot', 'key', 'grid', 'pointsize', 'size', 'samples', 'isosamples',
        'palette', 'colorbox', 'pm3d', 'cntrparam', 'contour', 'view', 'isosample',
        'angles', 'mapping', 'mouse', 'logscale', 'rrange', 'trange', 'urange', 'vrange',
        'parametric', 'polar', 'font', 'format', 'label', 'arrow', 'linetype',
        'linestyle', 'dashtype', 'linewidth', 'textcolor', 'border', 'notitle',
        'enhanced', 'svg', 'png', 'jpg', 'gif', 'eps', 'pdf', 'background'
      ];

      // Handle Gnuplot functions
      const functions = [
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'sinh', 'cosh', 'tanh',
        'log', 'log10', 'exp', 'sqrt', 'abs', 'ceil', 'floor', 'int', 'round', 'sgn',
        'besj0', 'besj1', 'besy0', 'besy1', 'erf', 'erfc', 'gamma', 'lgamma',
        'ibeta', 'igamma', 'rand', 'real', 'imag', 'arg', 'sprintf', 'strlen',
        'substr', 'strstrt', 'system', 'word', 'words', 'column'
      ];

      // Handle plot styles
      const plotStyles = [
        'lines', 'points', 'linespoints', 'impulses', 'dots', 'steps', 'fsteps',
        'histeps', 'errorbars', 'xerrorbars', 'yerrorbars', 'xyerrorbars',
        'boxes', 'boxerrorbars', 'boxxyerrorbars', 'financebars', 'candlesticks',
        'vectors', 'image', 'rgbimage', 'pm3d', 'labels', 'histograms'
      ];

      // Check for keywords at the start of the token
      const word = stream.match(/^\w+/) as RegExpMatchArray | null;
      if (word) {
        const wordStr = word[0].toLowerCase();
        if (keywords.includes(wordStr)) {
          return 'keyword';
        }
        if (functions.includes(wordStr)) {
          return 'function';
        }
        if (plotStyles.includes(wordStr)) {
          return 'style';
        }
        return 'variable';
      }

      // Handle operators
      if (stream.match(/[+\-*/%^=<>!&|~\[\]\(\),;:]/)) {
        return 'operator';
      }

      // Skip non-matched characters
      stream.next();
      return null;
    },
    startState() {
      return {};
    }
  });
}

// Create a LanguageSupport instance for Gnuplot
export function gnuplotLanguage() {
  return new LanguageSupport(gnuplot());
}
