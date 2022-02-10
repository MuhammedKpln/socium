import { useCallback, useRef } from 'react'
import Haptic from 'react-native-haptic-feedback'

interface IHapticOptions {
  repeat?: boolean
  interval?: number
}

export function useHaptic(options?: IHapticOptions) {
  let timer = useRef<NodeJS.Timer | null>(null)

  const trigger = useCallback(
    (type: Haptic.HapticFeedbackTypes = 'impactHeavy') => {
      if (options?.repeat) {
        timer.current = setInterval(() => {
          Haptic.trigger(type, {
            enableVibrateFallback: true,
          })
        }, options.interval ?? 500)

        return
      }

      Haptic.trigger(type, {
        enableVibrateFallback: true,
      })
    },
    [options],
  )

  const cancel = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [timer])

  return { trigger, cancel }
}
