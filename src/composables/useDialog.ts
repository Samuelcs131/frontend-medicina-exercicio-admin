import { ref } from 'vue'

export interface IDialog {
  [loaderId: string]: {
    isOpen: boolean
    data?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const dialogState = ref<IDialog>({})

export function useDialog() {
  function createDialog(dialogId: string[]) {
    dialogId.forEach((id) => {
      dialogState.value[id] = { isOpen: false }
    })
  }

  function dialogIsOpen(dialogId: string): boolean {
    return dialogState.value[dialogId]?.isOpen || false
  }

  function toggleDialog(dialogId: string) {
    if (dialogState.value[dialogId])
      dialogState.value[dialogId].isOpen = !dialogState.value[dialogId].isOpen
  }

  function clearDataDialog(dialogId: string) {
    if (dialogState.value[dialogId])
      dialogState.value[dialogId].data = undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setDataDialog(dialogId: string, data?: any) {
    if (dialogState.value[dialogId]) dialogState.value[dialogId].data = data
  }

  function closeDialog(dialogId: string) {
    if (dialogState.value[dialogId]) dialogState.value[dialogId].isOpen = false
  }

  return {
    dialogState,
    closeDialog,
    createDialog,
    dialogIsOpen,
    toggleDialog,
    setDataDialog,
    clearDataDialog,
  }
}
