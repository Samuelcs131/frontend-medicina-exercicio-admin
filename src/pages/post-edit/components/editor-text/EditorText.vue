<template>
  <q-dialog
    :model-value="dialogIsOpen(Dialog.editPost)"
    @before-show="initializeEditorText"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card
      :style="{
        maxWidth: `${maxWidthContent + 56}px`,
        display: 'flex',
        flexDirection: 'column',
      }"
      class="post shadow-0 q-mb-md full-width full-height"
      bordered
    >
      <q-card-section v-if="state.postOrder != null" class="q-py-xs">
        <h1 class="text-h6 q-ma-none">Seção {{ state.postOrder }}</h1>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pb-none">
        <div class="flex gap-sm">
          <q-btn
            size="sm"
            dense
            flat
            icon="undo"
            :disable="!editorInstance?.can().chain().focus().undo().run()"
            @click="editorInstance?.chain().focus().undo().run()"
          >
            <q-tooltip>Desfazer</q-tooltip>
          </q-btn>

          <q-btn
            size="sm"
            dense
            flat
            icon="redo"
            :disabled="!editorInstance?.can().chain().focus().redo().run()"
            @click="editorInstance?.chain().focus().redo().run()"
          >
            <q-tooltip>Refazer</q-tooltip>
          </q-btn>

          <q-separator vertical />

          <q-btn-dropdown
            size="sm"
            flat
            dense
            no-icon-animation
            dropdown-icon="title"
          >
            <q-list>
              <q-item
                dense
                clickable
                v-close-popup
                :class="
                  editorInstance?.isActive('heading', { level: 1 })
                    ? 'text-primary'
                    : undefined
                "
                @click="
                  editorInstance
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: 1 })
                    .run()
                "
              >
                <q-item-section avatar>
                  <q-icon :name="mdiFormatHeader1" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Título 1</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                dense
                clickable
                v-close-popup
                :class="
                  editorInstance?.isActive('heading', { level: 2 })
                    ? 'text-primary'
                    : undefined
                "
                @click="
                  editorInstance
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: 2 })
                    .run()
                "
              >
                <q-item-section avatar>
                  <q-icon :name="mdiFormatHeader2" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Título 2</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                dense
                clickable
                v-close-popup
                :class="
                  editorInstance?.isActive('heading', { level: 3 })
                    ? 'text-primary'
                    : undefined
                "
                @click="
                  editorInstance
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                "
              >
                <q-item-section avatar>
                  <q-icon :name="mdiFormatHeader3" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Título 3</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-separator vertical />

          <q-btn
            size="sm"
            dense
            flat
            icon="format_bold"
            :color="editorInstance?.isActive('bold') ? 'primary' : undefined"
            @click="editorInstance?.chain().focus().toggleBold().run()"
          >
            <q-tooltip>Negrito</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            dense
            flat
            icon="format_italic"
            :color="editorInstance?.isActive('italic') ? 'primary' : undefined"
            @click="editorInstance?.chain().focus().toggleItalic().run()"
          >
            <q-tooltip>Italico</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            dense
            flat
            icon="format_underline"
            :color="
              editorInstance?.isActive('underline') ? 'primary' : undefined
            "
            @click="editorInstance?.chain().focus().toggleUnderline().run()"
          >
            <q-tooltip>Sublinhado</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            dense
            flat
            icon="format_strikethrough"
            :color="editorInstance?.isActive('strike') ? 'primary' : undefined"
            @click="editorInstance?.chain().focus().toggleStrike().run()"
          >
            <q-tooltip>Tachado</q-tooltip>
          </q-btn>

          <q-separator vertical />

          <q-btn
            size="sm"
            dense
            flat
            icon="format_align_left"
            @click="editorInstance?.chain().focus().setTextAlign('left').run()"
            :color="
              editorInstance?.isActive({ textAlign: 'left' })
                ? 'primary'
                : undefined
            "
          >
            <q-tooltip>Esquerda</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            dense
            flat
            icon="format_align_center"
            @click="
              editorInstance?.chain().focus().setTextAlign('center').run()
            "
            :color="
              editorInstance?.isActive({ textAlign: 'center' })
                ? 'primary'
                : undefined
            "
          >
            <q-tooltip>Centro</q-tooltip>
          </q-btn>

          <q-btn
            size="sm"
            dense
            flat
            icon="format_align_right"
            @click="editorInstance?.chain().focus().setTextAlign('right').run()"
            :color="
              editorInstance?.isActive({ textAlign: 'right' })
                ? 'primary'
                : undefined
            "
          >
            <q-tooltip>Direita</q-tooltip>
          </q-btn>

          <q-btn
            size="sm"
            dense
            flat
            icon="format_align_justify"
            @click="
              editorInstance?.chain().focus().setTextAlign('justify').run()
            "
            :color="
              editorInstance?.isActive({ textAlign: 'justify' })
                ? 'primary'
                : undefined
            "
          >
            <q-tooltip>Justificado</q-tooltip>
          </q-btn>

          <q-separator vertical />

          <q-btn
            size="sm"
            dense
            flat
            icon="format_list_bulleted"
            :color="
              editorInstance?.isActive('bulletList') ? 'primary' : undefined
            "
            @click="editorInstance?.chain().focus().toggleBulletList().run()"
          >
            <q-tooltip>Lista de marcadores</q-tooltip>
          </q-btn>

          <q-btn
            size="sm"
            dense
            icon="format_list_numbered"
            flat
            :color="
              editorInstance?.isActive('orderedList') ? 'primary' : undefined
            "
            @click="editorInstance?.chain().focus().toggleOrderedList().run()"
          >
            <q-tooltip>Lista ordenada</q-tooltip>
          </q-btn>

          <q-separator vertical />

          <q-btn
            size="sm"
            dense
            flat
            icon="link"
            :color="editorInstance?.isActive('link') ? 'primary' : undefined"
            @click="setLink"
          >
            <q-tooltip>Link</q-tooltip>
          </q-btn>
          <q-btn @click="openImageDialog" size="sm" dense flat icon="image">
            <q-tooltip>Imagem</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            dense
            flat
            icon="format_quote"
            :color="
              editorInstance?.isActive('blockquote') ? 'primary' : undefined
            "
            @click="editorInstance?.chain().focus().toggleBlockquote().run()"
          >
            <q-tooltip>Citação</q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            dense
            flat
            icon="table_chart"
            @click="
              editorInstance
                ?.chain()
                .focus()
                .insertContent(tableDefaultHTML, {
                  parseOptions: { preserveWhitespace: false },
                })
                .run()
            "
          >
            <q-tooltip>Tabela</q-tooltip>
          </q-btn>
          <q-btn-dropdown
            size="sm"
            flat
            dense
            no-icon-animation
            dropdown-icon="play_circle"
          >
            <q-list>
              <q-item dense clickable v-close-popup @click="addIframe">
                <q-item-section>
                  <q-item-label>Adicionar mídia</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                dense
                clickable
                v-close-popup
                @click="toggleDialog(Dialog.midiaTutorial)"
              >
                <q-item-section>
                  <q-item-label>Como adicionar mídia?</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn
            size="sm"
            dense
            flat
            @click="editorInstance?.chain().focus().setHorizontalRule().run()"
            icon="horizontal_rule"
          >
            <q-tooltip>Divisor</q-tooltip>
          </q-btn>

          <template v-if="editorInstance?.isActive('table')">
            <q-separator vertical />
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableLargeRemove"
              @click="editorInstance?.commands.deleteTable()"
            >
              <q-tooltip>Remove table</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableColumnPlusBefore"
              @click="editorInstance?.commands.addColumnBefore()"
            >
              <q-tooltip>Add column before</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableColumnPlusAfter"
              @click="editorInstance?.commands.addColumnAfter()"
            >
              <q-tooltip>Add column after</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableColumnRemove"
              @click="editorInstance?.commands.deleteColumn()"
            >
              <q-tooltip>Remove column</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableRowPlusBefore"
              @click="editorInstance?.commands.addRowBefore()"
            >
              <q-tooltip>Add row before</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableRowPlusAfter"
              @click="editorInstance?.commands.addRowAfter()"
            >
              <q-tooltip>Add row after"</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableRowRemove"
              @click="editorInstance?.commands.deleteRow()"
            >
              <q-tooltip>Remove row</q-tooltip>
            </q-btn>
            <q-btn
              dense
              size="sm"
              flat
              :icon="mdiTableMergeCells"
              @click="editorInstance?.commands.mergeOrSplit()"
            >
              <q-tooltip>Merge or split cell</q-tooltip>
            </q-btn>
          </template>
        </div>
      </q-card-section>

      <q-card-section class="full-height" style="overflow-y: auto">
        <EditorContent
          v-if="editorInstance"
          :editor="editorInstance"
          style="
            min-height: 100px;
            border: 1px solid rgba(131, 131, 131, 0.5);
            padding: 10px;
            border-radius: 4px;
          "
          class="full-height full-width"
          :style="{
            maxWidth: `${maxWidthContent + 24}px`,
          }"
        />
      </q-card-section>

      <q-card-section class="q-pt-sm" align="right">
        <div class="text-right text-sm text-grey">
          {{ editorInstance?.storage.characterCount.characters() }}
          Caracteres,
          {{ editorInstance?.storage.characterCount.words() }} Palavras
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section aling="bottom">
        <div class="flex gap-sm justify-end full-width">
          <q-btn @click="closeDialog" flat label="Cancelar" color="accent" />

          <q-btn
            @click="savePostSection(editorInstance?.getHTML() || '')"
            label="Salvar"
            color="primary"
          />
        </div>
      </q-card-section>
    </q-card>
    <image-dialog @image="addImage" />
    <midia-tutorial-dialog />
  </q-dialog>
</template>
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { Editor, EditorContent, useEditor } from '@tiptap/vue-3'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import MidiaTutorialDialog from 'src/pages/post-edit/components/MidiaTutorialDialog.vue'
import {
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiTableColumnPlusAfter,
  mdiTableColumnPlusBefore,
  mdiTableMergeCells,
  mdiTableRowPlusAfter,
  mdiTableLargeRemove,
  mdiTableRowRemove,
  mdiTableRowPlusBefore,
  mdiTableColumnRemove,
} from '@quasar/extras/mdi-v7'
import { usePostEditPage } from '../../usePostEditPage'
import {
  editorOptions,
  tableDefaultHTML,
  maxWidthContent,
} from '../../editor.const'
import { cloneDeep } from 'src/utils/clone.util'
import { uniqueId } from 'src/utils/random.util'
import ImageDialog from './components/ImageDialog.vue'
import { IPostItem } from 'src/types/post/IPost.type'

interface IImageDialog {
  url: string
  alt: string
  file?: File
  width: number
  height: number
}

const { state, Dialog, dialogIsOpen, toggleDialog, openImageDialog } =
  usePostEditPage()

const editorInstance = useEditor({
  ...cloneDeep(editorOptions),
})

function savePostSection(content: string) {
  const { key, imageFiles } = state.value.postItem

  removeUnusedImages(content)

  if (key) {
    const idx = state.value.form.postItems.findIndex((item) => item.key === key)

    state.value.form.postItems[idx] = {
      key,
      contentHTML: content,
      postTypeContent: PostTypeContent.html,
      imageFiles,
    } as IPostItem
  } else {
    state.value.form.postItems.push({
      key: uniqueId(),
      contentHTML: content,
      postTypeContent: PostTypeContent.html,
      imageFiles,
    } as IPostItem)
  }

  toggleDialog(Dialog.editPost)
}

function removeUnusedImages(content: string) {
  for (const property in state.value.postItem.imageFiles) {
    if (!content.includes(property)) {
      delete state.value.postItem.imageFiles[property]
    }
  }
}

function closeDialog() {
  editorInstance.value?.destroy()

  editorInstance.value = new Editor({
    ...cloneDeep(editorOptions),
  })
  state.value.postOrder = null
  toggleDialog(Dialog.editPost)
}

function addIframe() {
  const url = window.prompt('URL')

  if (url) {
    editorInstance.value?.chain().focus().setIframe({ src: url }).run()
  }
}

function initializeEditorText() {
  editorInstance.value?.commands.setContent(state.value.postItem.contentHTML)
}

function addImage(image: IImageDialog) {
  if (!state.value.postItem.imageFiles) state.value.postItem.imageFiles = {}

  const imageData = {
    src: image.url,
    alt: image.alt,
    width: image.width,
    height: image.width,
  }

  if (image.url) {
    editorInstance.value?.commands.setImage(imageData)
  } else if (image.file) {
    if (image.file) imageData.src = URL.createObjectURL(image.file)

    editorInstance.value?.commands.setImage(imageData)
    state.value.postItem.imageFiles[imageData.src] = image.file
  }
}

function setLink() {
  const previousUrl = editorInstance.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) return

  if (url === '') {
    return editorInstance.value
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()
  }

  editorInstance.value
    ?.chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: url })
    .run()
}

onBeforeUnmount(() => {
  editorInstance.value?.destroy()
})
</script>
<style lang="scss" scoped>
.tiptap {
}
</style>
