import React from 'react'

interface IToastRef {
  fire: (
    toastStatus: ToastStatus,
    message: string,
    options?: IToastAdditionalOptions,
  ) => void
}

export interface IToastAdditionalOptions {
  showLoader: boolean
}

export enum ToastStatus {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export const toastRef = React.createRef<IToastRef>()

export function showToast(
  toastStatus: ToastStatus,
  message: string,
  options?: IToastAdditionalOptions,
) {
  toastRef.current?.fire(toastStatus, message, options)
}
