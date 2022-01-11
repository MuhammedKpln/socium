import { ToastStatus } from '@/utils/toast'
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Incubator } from 'react-native-ui-lib'

const ToastUI = Incubator.Toast
const ToastPresets = Incubator.ToastPresets

const _Toast = (_: any, ref: any) => {
  const [message, setMessage] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [toastStatus, setToastStatus] = useState<ToastStatus>(ToastStatus.Info)

  useImperativeHandle(
    ref,
    useCallback(
      () => ({
        fire: (_toastStatus: ToastStatus, _message: string) => {
          setMessage(_message)
          setToastStatus(_toastStatus)
          setVisible(true)
        },
      }),
      [setMessage, setVisible, setToastStatus],
    ),
  )

  const toastPreset = useMemo(() => {
    switch (toastStatus) {
      case ToastStatus.Info:
        return ToastPresets.GENERAL

      case ToastStatus.Error:
        return ToastPresets.FAILURE

      case ToastStatus.Success:
        return ToastPresets.SUCCESS
    }
  }, [toastStatus])

  return (
    <ToastUI
      autoDismiss={3000}
      message={message}
      visible={visible}
      onDismiss={() => setVisible(false)}
      preset={toastPreset}
      swipeable
      centerMessage
      position="top"
    />
  )
}

export const Toast = React.forwardRef(_Toast)
