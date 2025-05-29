

export type ActionConfiguration = {
  callback: (data?: unknown) => unknown
  loaders?: string[]
  successMessageTitle?: string
  successMessage?: string
  errorMessageTitle?: string
  errorMessage?: string
  showAPIError?: boolean
  messageTimeout?: number
  successCallback?: () => unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorCallback?: (error: any) => unknown
  errorMessageStatus?: IErrorMessageStatus
}

interface IErrorMessageStatus {
  [key: number]: string
}
