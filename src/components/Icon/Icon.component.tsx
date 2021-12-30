import icoMoonConfig from '@/assets/fonts/selection.json'
import { useAppSelector } from '@/store'
import React from 'react'
import { useMemo } from 'react'
import { Colors } from 'react-native-ui-lib'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import { IconProps } from 'react-native-vector-icons/Icon'

const _Icon = createIconSetFromIcoMoon(icoMoonConfig)

export const Icon = React.memo((props: IconProps) => {
  const theme = useAppSelector(state => state.themeReducer.theme)
  const fontColor = useMemo(() => {
    return theme === 'dark' ? Colors.white : Colors.black
  }, [theme])

  return <_Icon {...props} color={fontColor} style={{ color: fontColor }} />
})
