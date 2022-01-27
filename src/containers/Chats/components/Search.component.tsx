import { Icon } from '@/components/Icon/Icon.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import React from 'react'
import { View } from 'react-native-ui-lib'

interface IProps {
  onChangeText: (text: string) => void
}

export function Search(props: IProps) {
  const { onChangeText } = props
  return (
    <View>
      <TextInput
        autoCapitalize="none"
        leadingAccessory={
          <Icon name="search" size={22} style={{ marginRight: 10 }} />
        }
        placeholder="Ara"
        onChangeText={onChangeText}
      />
    </View>
  )
}
