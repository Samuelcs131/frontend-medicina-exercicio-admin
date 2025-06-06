import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TiptapImage from '@tiptap/extension-image'
import ImageView from './ImageView.vue'
import { ImageDisplay } from './utils/image'

export const DEFAULT_IMAGE_URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
export const DEFAULT_IMAGE_WIDTH = 200

const Image = TiptapImage.extend({
  inline() {
    return true
  },

  group() {
    return 'inline'
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: DEFAULT_IMAGE_WIDTH,
        parseHTML: (element) => {
          const width =
            element.style.width || element.getAttribute('width') || null
          return width == null ? null : parseInt(width, 10)
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height =
            element.style.height || element.getAttribute('height') || null
          return height == null ? null : parseInt(height, 10)
        },
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          }
        },
      },
      display: {
        default: ImageDisplay.INLINE,
        parseHTML: (element) => {
          const { cssFloat, display } = element.style
          let dp =
            element.getAttribute('data-display') ||
            element.getAttribute('display')
          if (dp) {
            dp = /(inline|block|left|right)/.test(dp) ? dp : ImageDisplay.INLINE
          } else if (cssFloat === 'left' && !display) {
            dp = ImageDisplay.FLOAT_LEFT
          } else if (cssFloat === 'right' && !display) {
            dp = ImageDisplay.FLOAT_RIGHT
          } else if (!cssFloat && display === 'block') {
            dp = ImageDisplay.BREAK_TEXT
          } else {
            dp = ImageDisplay.INLINE
          }

          return dp
        },
        renderHTML: (attributes) => {
          return {
            ['data-display']: attributes.display,
          }
        },
      },
    }
  },

  addOptions() {
    return {
      ...this.parent?.(),
      inline: true,
      uploadRequest: null,
      urlPattern: DEFAULT_IMAGE_URL_REGEX,
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageView)
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },
})

export default Image
