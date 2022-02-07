import React from 'react'
import { Incubator } from 'react-native-ui-lib'

interface IToastRef {
  fire: (
    toastStatus: ToastStatus,
    message: string,
    options?: IToastAdditionalOptions,
  ) => void
}

export interface IToastAdditionalOptions
  extends Omit<Incubator.ToastProps, 'autoDissmiss'> {}

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
