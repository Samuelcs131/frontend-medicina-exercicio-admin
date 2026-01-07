// extensions/AccordionTitle.ts
import { Node, mergeAttributes } from '@tiptap/core'

export const AccordionTitle = Node.create({
  name: 'accordionTitle',

  content: 'inline*',

  isolating: true,

 parseHTML() {
    return [{ tag: 'summary' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['summary', mergeAttributes(HTMLAttributes), 0]
  },
})
