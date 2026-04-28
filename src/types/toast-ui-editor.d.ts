declare module '@toast-ui/editor' {
  interface EditorOptions {
    el: HTMLElement
    initialEditType?: 'markdown' | 'wysiwyg'
    previewStyle?: 'tab' | 'vertical'
    usageStatistics?: boolean
  }

  export default class Editor {
    constructor(options: EditorOptions)
    getMarkdown(): string
    setMarkdown(markdown: string): void
    destroy(): void
  }
}
