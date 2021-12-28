import React from 'react'

interface IToastRef {
  fire: (toastStatus: ToastStatus, message: string) => void
}

export enum ToastStatus {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export const toastRef = React.createRef<IToastRef>()

export function showToast(toastStatus: ToastStatus, message: string) {
  toastRef.current?.fire(toastStatus, message)
}
