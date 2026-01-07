// extensions/AccordionContent.ts
import { Node, mergeAttributes } from '@tiptap/core'

export const AccordionContent = Node.create({
  name: 'accordionContent',

  content: 'block+',

 parseHTML() {
    return [{ tag: 'div' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0]
  },
})
