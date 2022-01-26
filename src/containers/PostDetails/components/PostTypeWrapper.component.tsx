import { Icon } from '@/components/Icon/Icon.component'
import { PostType } from '@/types/post.types'
import React from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
export interface IProps {
  postType: PostType
  children: React.ReactNode
}

export function PostTypeWrapper(props: IProps) {
  const { postType, children } = props
  console.log(postType)
  if (postType === PostType.Instagram) {
    return (
      <View br40 backgroundColor={Colors.surfaceBG} padding-20 width="100%">
        <View row>
          <Icon name="instagram" color="#7232bd" size={25} />
          <Text fontGilroy marginT-5 marginL-10 textColor>
            Instagram
          </Text>
        </View>

        <View marginT-20 width="100%">
          {children}
        </View>
      </View>
    )
  }

  if (postType === PostType.Youtube) {
    return (
      <View br40 backgroundColor={Colors.surfaceBG} padding-20 width="100%">
        <View row>
          <Icon name="youtube" color="#FF0000" size={25} />
          <Text fontGilroy marginT-5 marginL-10 textColor>
            YouTube
          </Text>
        </View>

        <View marginT-20 width="100%">
          {children}
        </View>
      </View>
    )
  }
  if (postType === PostType.Twitter) {
    return (
      <View br40 backgroundColor={Colors.surfaceBG} padding-20 width="100%">
        <View row>
          <Icon name="twitter" color="#1DA1F2" size={25} />
          <Text fontGilroy marginT-5 marginL-10 textColor>
            Twitter
          </Text>
        </View>

        <View marginT-20 width="100%">
          {children}
        </View>
      </View>
    )
  }

  return null
}
