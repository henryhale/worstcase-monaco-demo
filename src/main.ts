import loader from '@monaco-editor/loader';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import * as monaco from './monaco';
import { initEditor } from './init';

self.MonacoEnvironment = {
    async getWorker(_, label) {
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

loader.config({ monaco: monaco as any });

loader.init().then((instance) => {
    initEditor(instance)
});
