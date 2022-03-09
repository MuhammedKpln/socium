import { useHaptic } from '@/hooks/useHaptic'
import { IToastAdditionalOptions, ToastStatus } from '@/utils/toast'
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
  const [additionalOptions, setAdditionalOptions] =
    useState<IToastAdditionalOptions>()
  const { trigger } = useHaptic()

  useImperativeHandle(
    ref,
    useCallback(
      () => ({
        fire: (
          _toastStatus: ToastStatus,
          _message: string,
          _additionalOptions?: IToastAdditionalOptions,
        ) => {
          setMessage(_message)
          setToastStatus(_toastStatus)
          setVisible(true)
          setAdditionalOptions(_additionalOptions)
          trigger('impactLight')
        },
      }),
      [setMessage, setVisible, setToastStatus, trigger],
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
      autoDismiss={additionalOptions?.action ? 0 : 3000}
      message={message}
      visible={visible}
      onDismiss={() => setVisible(false)}
      preset={toastPreset}
      swipeable
      centerMessage
      position={'top'}
      enableHapticFeedback
      zIndex={100}
      {...additionalOptions}
    />
  )
}

export const Toast = React.forwardRef(_Toast)
