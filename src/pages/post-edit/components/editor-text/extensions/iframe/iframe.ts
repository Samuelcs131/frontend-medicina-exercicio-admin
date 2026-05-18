import { Node, nodeInputRule } from '@tiptap/core'

export interface IframeOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType
    }
  }
}

export default Node.create<IframeOptions>({
  name: 'iframe',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      height: {
        default: '400',
        parseHTML: (element) => element.getAttribute('height') ?? '400',
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('width') ?? '100%',
      },
      title: {
        default: 'YouTube video player',
        parseHTML: (element) => element.getAttribute('title') ?? 'YouTube video player',
      },
      frameborder: {
        default: 0,
      },
      allow: {
        default:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        parseHTML: (element) =>
          element.getAttribute('allow') ??
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      },
      referrerpolicy: {
        default: 'strict-origin-when-cross-origin',
        parseHTML: (element) =>
          element.getAttribute('referrerpolicy') ?? 'strict-origin-when-cross-origin',
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', HTMLAttributes]
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = this.type.create(options)

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },

  addInputRules() {
    const videoIdGroup = '([a-zA-Z0-9_-]+)'
    return [
      nodeInputRule({
        find: new RegExp(
          `(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/watch\\?v=|youtu\\.be\\/)${videoIdGroup}\\s*$`,
        ),
        type: this.type,
        getAttributes: (match) => ({
          src: `https://www.youtube.com/embed/${match[4]}`,
        }),
      }),
    ]
  },
})
