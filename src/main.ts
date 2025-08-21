import { editor } from './monaco'
import { WorstcaseExtension } from './extension'
import snippets from "./snippets"

// Initialize Monaco Editor
function initEditor(): void {
  const editorContainer = document.getElementById('editor-container')
  const toggleButton = document.getElementById('toggle-btn') as HTMLButtonElement

  if (!editorContainer || !toggleButton) {
    console.error('Required DOM elements not found')
    return
  }

  // Create editor
  const codeEditor = editor.create(editorContainer, {
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

  // Setup toggle button
  toggleButton.addEventListener('click', () => {
    worstcaseExtension.toggle()

    if (worstcaseExtension.isEnabled()) {
      toggleButton.textContent = 'Hide Analysis'
      toggleButton.classList.add('disabled')
    } else {
      toggleButton.textContent = 'Show Analysis'
      toggleButton.classList.remove('disabled')
    }
  })

  // Add context menu option
  codeEditor.addAction({
    id: 'toggle-worstcase-analysis',
    label: 'Toggle Worstcase Analysis',
    contextMenuGroupId: '1_modification',
    run: () => {
      toggleButton.click()
    }
  })

  // Handle window resize
  window.addEventListener('resize', () => {
    codeEditor.layout()
  })

  console.log('Monaco Editor with Worstcase extension initialized!')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEditor)
} else {
  initEditor()
}

