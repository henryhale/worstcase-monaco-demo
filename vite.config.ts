import { defineConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig({
    base: "/worstcase-monaco-demo/",
    plugins: [
        monacoEditorPlugin.default({
            forceBuildCDN: true
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('monaco-editor/esm/vs/editor/browser')) {
                        return 'browser'
                    }
                    if (id.includes('monaco-editor/esm/vs/editor/common')) {
                        return 'common'
                    }

                }
            }
        }
    }
})