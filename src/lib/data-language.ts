import { LanguageSupport, StreamLanguage } from '@codemirror/language';

// Define the Data language for CodeMirror
export function data() {
  return StreamLanguage.define({
    token(stream) {
      // Handle comments
      if (stream.match('#')) {
        stream.skipToEnd();
        return 'comment';
      }

      // Handle numbers
      if (stream.match(/^-?\d+(\.\d+)?([eE][+-]?\d+)?/)) {
        return 'number';
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

// Create a LanguageSupport instance for Data files
export function dataLanguage() {
  return new LanguageSupport(data());
}
