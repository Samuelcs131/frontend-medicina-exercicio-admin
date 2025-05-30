<template>
  <q-page class="container q-layout-padding">
    <h1 class="text-h5">Editar postagem</h1>

    <q-form @submit="savePost">
      <q-expansion-item
        :model-value="true"
        style="border-radius: 4px"
        icon="article"
        label="Configurações"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
      >
        <q-card class="shadow-0" bordered>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="state.form.title"
                  outlined
                  dense
                  label="Título da postagem"
                  :rules="[requiredRule]"
                  type="text"
                  @update:model-value="handleSlugURL"
                />
              </div>
              <div class="col-12 col-md-6">
                <date-picker
                  rule-active
                  dense
                  label="Data de agendamento"
                  v-model="state.form.schedulingDate"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="state.form.url"
                  outlined
                  dense
                  label="URL da publicação"
                  readonly
                  :rules="[requiredRule]"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-bind="$vSelect"
                  v-model="state.form.status"
                  :options="statusOptions"
                  label="Status"
                  :rules="[requiredRule]"
                />
              </div>
              <div class="col-12">
                <q-uploader
                  ref="uploadInput"
                  class="full-width"
                  bordered
                  flat
                  hide-upload-btn
                  v-model="state.form.thumbnailFile"
                  @added="handleSetFile"
                  @removed="handleRemoveFile"
                  label="Thumbnail"
                  accept=".jpeg, .png, .jpg , .webp"
                />
                <p>
                  O arquivo não pode ultrapassar 1 mega, formatos aceitos .jpeg,
                  .png, .jpg, .webp
                </p>
              </div>
              <div class="col-12" v-if="state.form.thumbnailUrlImage">
                <q-img
                  height="200px"
                  :src="state.form.thumbnailUrlImage"
                  fit="contain"
                />
                <q-separator class="q-mt-md" />
              </div>

              <div class="col-12">
                <q-input
                  v-bind="$vInput"
                  v-model="state.form.thumbnailAlt"
                  label="Descrição da thumbnail - Alt"
                  :rules="[requiredRule]"
                />
              </div>

              <div class="col-12">
                <p class="text-caption q-mb-sm">Autoria</p>
                <q-separator />
              </div>

              <div class="col-12">
                <q-select
                  v-bind="$vSelect"
                  v-model="state.form.professionalId"
                  :options="state.options.professional"
                  option-value="id"
                  label="Profissional"
                  clearable
                  class="q-mb-md"
                  @update:model-value="handleProfessional"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="state.form.author"
                  label="Autor"
                  outlined
                  dense
                  :rules="[requiredRule]"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="state.form.authorDescription"
                  label="Descrição do autor"
                  outlined
                  dense
                  :rules="[requiredRule]"
                />
              </div>

              <div class="col-12">
                <p class="text-caption q-mb-sm">Categorização</p>
                <q-separator />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-bind="$vSelect"
                  v-model="state.form.specialtyId"
                  :options="state.options.specialties"
                  option-value="id"
                  label="Especialidade"
                  :rules="[requiredRule]"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-bind="$vSelect"
                  v-model="state.form.subspecialtyId"
                  :options="state.options.subspecialties"
                  option-value="id"
                  label="Subespecialidade"
                  :rules="[requiredRule]"
                />
              </div>

              <div class="col-12">
                <p class="text-caption q-mb-sm">Informações de SEO</p>
                <q-separator />
              </div>

              <div class="col-12">
                <q-input
                  label="Título"
                  v-model="state.form.tagTitle"
                  dense
                  outlined
                  counter
                  :maxlength="200"
                  :rules="[(v) => rangeRule(v, 0, 200)]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  label="Descrição"
                  v-model="state.form.tagDescription"
                  dense
                  outlined
                  counter
                  :maxlength="150"
                  :rules="[(v) => rangeRule(v, 0, 150)]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  label="Palavras-chave"
                  v-model="state.form.tagKeywords"
                  dense
                  outlined
                  counter
                  :maxlength="300"
                  hint="Separe as palavras por vírgula"
                  :rules="[(v) => rangeRule(v, 0, 300)]"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <div class="flex items-end justify-between full-width q-mt-lg">
        <span>
          <q-btn
            @click="toggleDialog(Dialog.viewPost)"
            label="Visualizar postagem"
            outline
          >
            <q-tooltip>Visualizar</q-tooltip>
          </q-btn>
        </span>

        <div class="q-gutter-md">
          <q-btn @click="router.push({ name: 'post' })" flat label="Cancelar" />
          <q-btn
            :disable="
              !state.form.thumbnailUrlImage && state.form.thumbnailFile == null
            "
            type="submit"
            color="primary"
            label="Salvar"
          />
        </div>
      </div>
    </q-form>

    <q-separator class="q-my-lg" />

    <draggable
      v-if="state.form.postItems"
      v-model="state.form.postItems"
      item-key="id"
      class="list-select-options"
      handle=".draggable-move"
      :animation="200"
    >
      <template #item="{ index, element }">
        <q-card class="shadow-0 q-mb-md" bordered>
          <q-card-section>
            <div class="flex justify-between">
              <div class="flex items-center gap-sm">
                <q-icon name="drag_indicator" class="draggable-move" />
                <p class="q-ma-none">seção {{ index }}</p>
              </div>

              <div class="q-gutter-sm">
                <q-btn
                  @click="handleOpen(index, element)"
                  icon="edit"
                  size="sm"
                  outline
                  color="secondary"
                />
                <q-btn
                  @click="removeSection(element.key)"
                  icon="delete"
                  size="sm"
                  outline
                  color="red"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div
              class="tiptap ProseMirror"
              v-if="element.postTypeContent == PostTypeContent.html"
              v-html="element.contentHTML"
            ></div>
          </q-card-section>
        </q-card>
      </template>
    </draggable>

    <div class="flex justify-center items-center">
      <q-btn-dropdown outline color="primary" label="Adicionar seção">
        <q-list>
          <q-item clickable v-close-popup @click="openNewPost()">
            <q-item-section>
              <q-item-label>HTML</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <edit-text />
    <view-post />
    <loading-full :loader-id="Loader.save" />
    <loading-full :loader-id="Loader.fetch" />
  </q-page>
</template>

<script setup lang="ts">
import DatePicker from 'src/components/date-picker/DatePicker.vue'
import draggable from 'vuedraggable'
import EditText from './components/editor-text/EditorText.vue'
import { usePostEditPage } from './usePostEditPage'
import { onMounted, onBeforeMount, ref } from 'vue'
import { requiredRule } from 'src/validations/form-rules/mixedRules.util'
import { useRoute, useRouter } from 'vue-router'
import { rangeRule } from 'src/validations/form-rules/stringRules.util'
import ViewPost from './components/ViewPost.vue'
import LoadingFull from 'src/components/loading/LoadingFull.vue'
import { PostTypeContent } from 'src/enums/post/PostTypeContent.enum'
import { IPostItem } from 'src/types/post/IPost.type'
import { QUploader } from 'quasar'
import { statusOptions } from 'src/constants/status.const'

const router = useRouter()
const route = useRoute()

const {
  state,
  Dialog,
  Loader,
  savePost,
  initState,
  fetchPost,
  openNewPost,
  createDialog,
  openEditPost,
  toggleDialog,
  handleSlugURL,
  removeSection,
  handleProfessional,
} = usePostEditPage()

const uploadInput = ref<QUploader | null>(null)

function handleSetFile(files: readonly File[]) {
  const [file] = files
  const maxSizeInBytes = 1 * 1024 * 1024

  if (!file) return

  if (file.size > maxSizeInBytes) {
    state.value.form.thumbnailFile = null
    uploadInput.value?.reset()

    window.alert('O arquivo possui mais que 1 mega')
  } else {
    state.value.form.thumbnailFile = file
  }
}

function handleRemoveFile() {
  state.value.form.thumbnailFile = null
}

function handleOpen(index: number, item: IPostItem) {
  if (item.postTypeContent === PostTypeContent.html) openEditPost(index)
}

onBeforeMount(() => {
  initState()
})

onMounted(async () => {
  const postId = route.params?.postId

  if (postId && !Array.isArray(postId)) await fetchPost(postId)

  createDialog([
    Dialog.editPost,
    Dialog.delete,
    Dialog.editPostImage,
    Dialog.viewPost,
    Dialog.carouselDialog,
    Dialog.midiaTutorial,
  ])
})
</script>
<style lang="scss">
.list-select-options {
  .drag-icon-options {
    opacity: 0;
  }
  .item-options {
    &:hover {
      .drag-icon-options {
        opacity: 1;
      }
    }
  }
  .draggable-handle-select-options {
    cursor: move;
  }

  .move-draggable-form-field {
    background: $grey-1;
  }
  .sortable-drag {
    opacity: 0;
    cursor: move;
  }
}

.draggable-move {
  cursor: move;
}
</style>
