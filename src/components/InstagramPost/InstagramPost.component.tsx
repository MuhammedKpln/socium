import React from 'react'
import FastImage from 'react-native-fast-image'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { Surface } from '../Surface/Surface.component'

interface IProps {
  authorName: string
  title: string
  thumbnailUrl: string
}
export function InstagramPost(props: IProps) {
  const { authorName, title, thumbnailUrl } = props

  return (
    <Surface>
      <View>
        <TouchableOpacity onPress={() => null}>
          <View marginL-10>
            <Text text50R text textColor>
              {authorName}
            </Text>
            <Text greyText text>
              @{authorName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FastImage
        source={{ uri: thumbnailUrl }}
        style={{
          width: '100%',
          height: 100,
          borderRadius: 4,
          marginTop: 20,
          marginRight: 10,
        }}
      />
      <Text marginV-10 greyText font13>
        {title.slice(0, 30)}
      </Text>
    </Surface>
  )
}
