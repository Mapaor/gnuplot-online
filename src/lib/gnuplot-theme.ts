import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Define our custom theme colors
export const gnuplotTheme = EditorView.theme({
  '&': {
    backgroundColor: 'white',
    color: '#333',
    fontFamily: 'monospace',
    fontSize: '14px',
    height: '24rem',
    borderRadius: '0.5rem',
    border: '1px solid rgb(209, 213, 219)'
  },
  '&.cm-focused': {
    outline: '2px solid rgb(59, 130, 246)',
    border: 'transparent'
  },
  '.cm-content': {
    padding: '12px'
  },
  '.cm-gutters': {
    backgroundColor: '#f9fafb',
    border: 'none',
    color: '#64748b',
    borderTopLeftRadius: '0.5rem',
    borderBottomLeftRadius: '0.5rem'
  },
  '.cm-gutterElement': {
    lineHeight: '1.5',
    padding: '0 3px'
  },
  '.cm-foldGutter': {
    width: '14px',
    padding: '0 2px'
  },
  '.cm-line': {
    padding: '0 5px'
  },
  '.cm-cursor': {
    borderLeftColor: '#000',
    borderLeftWidth: '2px'
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(243, 244, 246, 0.7)'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(243, 244, 246, 0.7)'
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(209, 213, 219, 0.5)'
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '0 2px'
  },
  '.cm-folded': {
    color: '#94a3b8'
  }
});

// Define syntax highlighting styles
export const gnuplotHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#8957e5' }, // purple for keywords
  { tag: tags.comment, color: '#6a737d', fontStyle: 'italic' }, // gray italic for comments
  { tag: tags.string, color: '#032f62' }, // dark blue for strings
  { tag: tags.number, color: '#005cc5' }, // blue for numbers
  { tag: tags.operator, color: '#d73a49' }, // red for operators
  { tag: tags.variableName, color: '#24292e' }, // default color for variables
  { tag: tags.function(tags.variableName), color: '#6f42c1' }, // purple for functions
  { tag: tags.definition(tags.variableName), color: '#22863a' }, // green for definitions
  { tag: [tags.typeName, tags.className], color: '#6f42c1' } // purple for types and classes
]);

// Combine theme and highlighting
export const gnuplotEditorTheme = [
  gnuplotTheme,
  syntaxHighlighting(gnuplotHighlightStyle)
];
