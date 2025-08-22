import { WorstcaseExtension } from './extension'
import snippets from "./snippets"

// Initialize Monaco Editor
export function initEditor(monaco: any): void {
  const editorContainer = document.getElementById('editor-container')
  const analysisButton = document.getElementById('analysis-btn') as HTMLButtonElement
  const cleanOutput = document.getElementById('clean-output') as HTMLInputElement


  if (!editorContainer || !analysisButton || !cleanOutput) {
    console.error('Required DOM elements not found')
    return
  }

  // Create editor
  const codeEditor = monaco.editor.create(editorContainer, {
    value: snippets,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
    lineNumbers: 'on',
    wordWrap: 'on',
    automaticLayout: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: true,
    renderWhitespace: 'selection',
    cursorBlinking: 'smooth'
  })

  // Initialize extension
  const worstcaseExtension = new WorstcaseExtension(codeEditor)

  // Setup analysis toggle button
  analysisButton.addEventListener('click', () => {
    worstcaseExtension.toggle()

    if (worstcaseExtension.isEnabled()) {
      analysisButton.textContent = 'Hide Analysis'
      analysisButton.classList.add('disabled')
    } else {
      analysisButton.textContent = 'Show Analysis'
      analysisButton.classList.remove('disabled')
    }
  })

  // Setup clean output checkbox
  cleanOutput.addEventListener('change', () => {
  	worstcaseExtension.toggleOutput()
  })

  // Add context menu option
  codeEditor.addAction({
    id: 'toggle-worstcase-analysis',
    label: 'Toggle Worstcase Analysis',
    contextMenuGroupId: '1_modification',
    run: () => {
      analysisButton.click()
    }
  })

  // Handle window resize
  window.addEventListener('resize', () => {
    codeEditor.layout()
  })

  console.log('Monaco Editor with Worstcase extension initialized!')
}



