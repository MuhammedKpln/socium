import NoData from '@/assets/images/NoData.svg'
import React from 'react'
import { Text, View } from 'react-native-ui-lib'
import { Surface } from '../Surface/Surface.component'

interface IProps {
  size?: number
  title?: string
  subtitle?: string
}

export function NotFound(props: IProps) {
  const { size = '100%', title = 'Bulunmadi', subtitle = 'bulunmadi' } = props

  return (
    <Surface center br30 padding-20>
      <NoData width={size} height={size} />
      <View marginT-20>
        <Text center font22 textColor>
          {title}
        </Text>
        <Text center font15 textColor marginT-10>
          {subtitle}
        </Text>
      </View>
    </Surface>
  )
}
