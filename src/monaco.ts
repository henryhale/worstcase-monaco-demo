await import('monaco-editor/esm/vs/editor/editor.all.js');
await import('monaco-editor/esm/vs/language/typescript/monaco.contribution');

export const { editor, Range } = await import('monaco-editor/esm/vs/editor/editor.api');
