import { useNotify } from 'src/composables/useNotify'
import type { ActionConfiguration } from './types/requesterConfig.type'
import { useLoader } from 'src/composables/useLoader'
import type { ICustomError } from './types/ICustomError.type'

/**
 * Classe para despachar ações com feedback visual e gerenciamento de estado de carregamento.
 */

export default class ActionDispatcher {
  static async dispatch(configuration: ActionConfiguration) {
    const {
      callback,
      loaders,
      successMessageTitle,
      successMessage,
      errorMessageStatus,
      errorMessageTitle,
      errorMessage,
      successCallback,
      errorCallback,
      messageTimeout,
    } = configuration

    this._startLoadersIfExists(loaders)

    try {
      await callback()
      this._showSuccessMessageIfExists(
        successMessageTitle,
        successMessage,
        messageTimeout,
      )

      if (successCallback) successCallback()
    } catch (error: unknown) {
      const errorStack = error as ICustomError

      console.error(errorStack)

      const errorMessageTitleFeedback = errorMessageTitle || ''
      const errorMessageFeedback = errorMessage || ''

      const err = error as any // eslint-disable-line @typescript-eslint/no-explicit-any

      if (err?.response?.status && errorMessageStatus) {
        const { status } = err.response

        this._showErrorMessageIfExists(
          errorMessageTitleFeedback,
          errorMessageStatus[status],
          messageTimeout,
        )
      } else {
        this._showErrorMessageIfExists(
          errorMessageTitleFeedback,
          errorMessageFeedback,
          messageTimeout,
        )
      }

      if (errorCallback) errorCallback(error)
    }

    this._endLoadersIfExists(loaders)
  }

  private static _startLoadersIfExists(loaders?: string[]) {
    if (!loaders || !loaders.length) return

    const { loaderStatus, toggleLoading } = useLoader()

    for (const loader of loaders) {
      if (!loaderStatus(loader)) toggleLoading(loader)
    }
  }

  private static _endLoadersIfExists(loaders?: string[]) {
    if (!loaders || !loaders.length) return

    const { loaderStatus, toggleLoading } = useLoader()

    for (const loader of loaders) {
      if (loaderStatus(loader)) toggleLoading(loader)
    }
  }

  private static _showErrorMessageIfExists(
    title?: string,
    errorMessage?: string,
    timeout?: number,
  ) {
    if (!errorMessage) return

    const { feedback } = useNotify()

    feedback({
      position: 'bottom-right',
      title: title ?? '',
      description: errorMessage,
      type: 'negative',
      timeout: timeout || 5000,
    })
  }

  private static _showSuccessMessageIfExists(
    title?: string,
    successMessage?: string,
    timeout?: number,
  ) {
    if (!successMessage && !title) return

    const { feedback } = useNotify()

    feedback({
      position: 'bottom-right',
      title: title || '',
      description: successMessage || '',
      type: 'positive',
      timeout: timeout || 5000,
    })
  }
}
