import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AccordionView from './AccordionView.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    accordion: {
      insertAccordion: () => ReturnType
    }
  }
}

export const Accordion = Node.create({
  name: 'accordion',
  group: 'block',
  content: 'accordionTitle accordionContent',
  defining: false,
  draggable: true,

  addCommands() {
    return {
      insertAccordion:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'accordion',
            attrs: { open: true },
            content: [
              {
                type: 'accordionTitle',
                content: [{ type: 'text', text: 'Título' }],
              },
              {
                type: 'accordionContent',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Conteúdo...' }],
                  },
                ],
              },
            ],
          })
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(AccordionView)
  },

  parseHTML() {
    return [{ tag: 'details' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes(HTMLAttributes), 0]
  },
})
