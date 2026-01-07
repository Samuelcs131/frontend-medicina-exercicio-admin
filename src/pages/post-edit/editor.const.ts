import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import History from '@tiptap/extension-history'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Blockquote } from '@tiptap/extension-blockquote'
import { HardBreak } from '@tiptap/extension-hard-break'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Youtube } from '@tiptap/extension-youtube'
import Dropcursor from '@tiptap/extension-dropcursor'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { Table } from '@tiptap/extension-table'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import Gapcursor from '@tiptap/extension-gapcursor'
import { EditorOptions } from '@tiptap/core'
import Image from 'src/pages/post-edit/components/editor-text/extensions/image/image'
import Iframe from 'src/pages/post-edit/components/editor-text/extensions/iframe/iframe'
import { Accordion } from './components/editor-text/extensions/accordion/accordion'
import { AccordionTitle } from './components/editor-text/extensions/accordion/accordionTitle'
import { AccordionContent } from './components/editor-text/extensions/accordion/accordionContent'

export const editorOptions = {
  editable: true,
  content: '',
  editorProps: {
    attributes: {
      class: 'blog full-height overflow-auto focus:outline-none prose mx-auto',
    },
  },
  extensions: [
    Paragraph,
    Document,
    Text,
    History,
    Heading.configure({
      levels: [1, 2, 3],
    }),
    Bold,
    Italic,
    Underline,
    Strike,
    ListItem,
    BulletList,
    OrderedList,
    Link,
    HardBreak,
    Blockquote,
    CharacterCount,
    Youtube,
    Dropcursor.configure({
      width: 2,
      color: '#2563eb',
    }),
    HorizontalRule,
    Table.configure({
      resizable: true,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Gapcursor,
    Iframe,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Accordion,
    AccordionTitle,
    AccordionContent,
    // ResizableMedia,
    Image,
  ],
} as Partial<EditorOptions>

export const tableDefaultHTML = `
  <table style="width:100%">
    <tr>
      <th>Firstname</th>
      <th>Lastname</th>
      <th>Age</th>
    </tr>
    <tr>
      <td>Jill</td>
      <td>Smith</td>
      <td>50</td>
    </tr>
    <tr>
      <td>Eve</td>
      <td>Jackson</td>
      <td>94</td>
    </tr>
    <tr>
      <td>John</td>
      <td>Doe</td>
      <td>80</td>
    </tr>
  </table>`

export const maxWidthContent = 856
