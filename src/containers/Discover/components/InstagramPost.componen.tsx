import { Icon } from '@/components/Icon/Icon.component'
import { IPostActionsProps } from '@/components/Post/Post.props'
import { IUser } from '@/types/login.types'
import { IPost } from '@/types/post.types'
import { IInstagramMeta } from '@/types/socialMedia.types'
import React, { useCallback, useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import { YoutubePostComponentStyles } from '../styles/YoutubePost.styles'
import { DiscoverPost } from './DiscoverPost.component'

export interface IInstagramPostProps
  extends Pick<
    IPostActionsProps,
    'onPressLike' | ('onPressComment' | 'onPressSave' | 'isLiked')
  > {
  post: IPost
  user: IUser
}

export function InstagramPost(props: IInstagramPostProps) {
  const { post } = props
  const [instagramMeta, setInstagramMeta] = useState<IInstagramMeta>()

  const fetchInstagramPost = useCallback(async () => {
    const url = `https://api.instagram.com/oembed/?url=${post.additional}`
    const response = await fetch(url)
    const data: IInstagramMeta = await response.json()

    setInstagramMeta(data)
  }, [post.additional])

  useEffect(() => {
    fetchInstagramPost()
  }, [fetchInstagramPost])

  return (
    <DiscoverPost {...props}>
      <ImageBackground
        source={{ uri: instagramMeta?.thumbnail_url }}
        style={YoutubePostComponentStyles.imageBackground}
        imageStyle={YoutubePostComponentStyles.imageBackgroundImage}
      >
        <Icon name="play-circle" size={45} color="#fff" />
      </ImageBackground>

      <View row bg-surfaceBG style={{ padding: 10, width: '100%' }}>
        <Icon name="instagram" color="#7232bd" size={25} />
        <View marginL-20>
          <Text textColor bold text>
            {instagramMeta?.title}
          </Text>
          <Text text50R text greyText>
            {instagramMeta?.title}
          </Text>
        </View>
      </View>
    </DiscoverPost>
  )
}
