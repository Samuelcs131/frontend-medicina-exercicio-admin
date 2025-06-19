import { Node } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nativeAccordion: {
      insertAccordion: () => ReturnType
    }
  }
}

export const NativeAccordion = Node.create({
  name: 'nativeAccordion',

  // Definindo o conteúdo permitido (summary seguido de content)
  content: 'accordionSummary accordionContent',

  group: 'block',

  defining: true,

  parseHTML() {
    return [{ tag: 'details' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', { ...HTMLAttributes, open: '' }, 0]
  },

  /* addNodeView() {
    return VueNodeViewRenderer(AccordionTiptap)
  }, */

  addCommands() {
    return {
      insertAccordion:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'accordionSummary',
                content: [{ type: 'text', text: 'Título do Accordion' }],
              },
              {
                type: 'accordionContent',
                content: [
                  {
                    type: 'paragraph', // Adicionando um parágrafo como conteúdo válido
                    content: [{ type: 'text', text: 'Conteúdo do Accordion' }],
                  },
                ],
              },
            ],
          })
        },
    }
  },
})

export const AccordionSummary = Node.create({
  name: 'accordionSummary',

  // Permite qualquer conteúdo inline (texto, negrito, itálico, etc.)
  content: 'inline*',

  // defining: true,
  defining: true,

  parseHTML() {
    return [{ tag: 'summary' }]
  },

  renderHTML() {
    return [
      'summary',
      {
        'data-type': 'accordion-summary',
      },
      0,
    ]
  },
})

export const AccordionContent = Node.create({
  name: 'accordionContent',

  // Permite um ou mais blocos (parágrafos, cabeçalhos, etc.)
  content: 'block+',

  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-type="accordion-content"]' }]
  },

  renderHTML() {
    return [
      'div',
      {
        'data-type': 'accordion-content',
      },
      0,
    ]
  },
})
