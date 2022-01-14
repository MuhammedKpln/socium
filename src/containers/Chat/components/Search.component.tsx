import { Icon } from '@/components/Icon/Icon.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import React from 'react'
import { View } from 'react-native-ui-lib'

export function Search() {
  return (
    <View>
      <TextInput
        leadingAccessory={
          <Icon name="search" size={22} style={{ marginRight: 10 }} />
        }
        placeholder="Ara"
      />
    </View>
  )
}
