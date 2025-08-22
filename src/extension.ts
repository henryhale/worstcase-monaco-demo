import { editor, Range } from "monaco-editor"
import { analyzeComplexity, type WCAnalysis } from "worstcase";

/**
 * worstcase
 * 
 * - an extension to compute the big o complexity of the javascript code 
 */
export class WorstcaseExtension {
    private editor: editor.IStandaloneCodeEditor
    private currentDecorations!: editor.IEditorDecorationsCollection
    private enabled: boolean = true
    private debouncedID: number | undefined

    constructor(codeEditor: editor.IStandaloneCodeEditor) {
        this.editor = codeEditor
        this.setupEventListeners()
        this.updateDecorations()
    }

    private setupEventListeners(): void {
        // Update decorations when content changes
        this.editor.onDidChangeModelContent(() => {
            // debounce the update to avoid excessive calls
            clearTimeout(this.debouncedID)
            this.debouncedID = setTimeout(() => this.updateDecorations(), 100)
        })
    }

    private createDecorations(): editor.IModelDeltaDecoration[] {
        if (!this.enabled) return []

        const model = this.editor.getModel()
        if (!model) return []

        const decorations: editor.IModelDeltaDecoration[] = []

        let analysis: WCAnalysis
        try {
            // analyze current javascript code
            analysis = analyzeComplexity(this.editor.getValue(), { clean: true })
        } catch (error) {
            console.debug(error)
            // no decorations
            return []
        }

        // create decorations for analyzed blocks
        for (const result of analysis.results) {
            const { node, space, time } = result
            const lineNumber = node.loc ? node.loc.start.line : null
            if (lineNumber === null) continue

            // skip the boring stuff like variable declaration
            if (space === "O(1)" && time === "O(1)") {
                continue
            }

            // focus on relevant blocks only
            if (!["ForStatement", "IfStatement", "CallExpression", "FunctionDeclaration"].includes(node.type)) {
                continue
            }

            const lineContent = model.getLineContent(lineNumber)
            const lineLength = lineContent.length

            const complexity = `space: ${space}, time: ${time}`

            decorations.push({
                range: new Range(lineNumber, lineLength + 1, lineNumber, lineLength + 1 + complexity.length),
                options: {
                    showIfCollapsed: true,
                    // hoverMessage: { value: complexity },
                    after: {
                        content: complexity,
                        inlineClassName: 'worstcase',
                    }
                }
            })

        }

        return decorations
    }

    public updateDecorations(): void {
        const newDecorations = this.createDecorations()
        if (this.currentDecorations) {
            this.currentDecorations.set(newDecorations)
        } else {
            this.currentDecorations = this.editor.createDecorationsCollection(newDecorations)
        }
    }

    public toggle(): void {
        this.enabled = !this.enabled
        this.updateDecorations()
    }

    public isEnabled(): boolean {
        return this.enabled
    }
}