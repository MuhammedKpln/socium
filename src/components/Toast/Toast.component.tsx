import { ToastStatus } from '@/utils/toast'
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Colors } from 'react-native-ui-lib'
import ToastUI from 'react-native-ui-lib/toast'

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

  const bgColor = useMemo(() => {
    switch (toastStatus) {
      case ToastStatus.Info:
        return Colors.info

      case ToastStatus.Error:
        return Colors.error

      case ToastStatus.Success:
        return Colors.success
    }
  }, [toastStatus])

  return (
    <ToastUI
      autoDismiss={2500}
      message={message}
      visible={visible}
      showDismiss
      onDismiss={() => setVisible(false)}
      backgroundColor={bgColor}
    />
  )
}

export const Toast = React.forwardRef(_Toast)
