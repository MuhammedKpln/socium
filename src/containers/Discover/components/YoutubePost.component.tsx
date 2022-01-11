import Youtube from '@/assets/icons/Youtube'
import { Icon } from '@/components/Icon/Icon.component'
import { IPostActionsProps } from '@/components/Post/Post.props'
import { IUser } from '@/types/login.types'
import { IPost } from '@/types/post.types'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, ImageBackground } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import { getYoutubeMeta, YoutubeMeta } from 'react-native-youtube-iframe'
import { YoutubePostComponentStyles } from '../styles/YoutubePost.styles'
import { DiscoverPost } from './DiscoverPost.component'

export interface IYoutubePostProps
  extends Pick<
    IPostActionsProps,
    'onPressLike' | ('onPressComment' | 'onPressSave' | 'isLiked')
  > {
  post: IPost
  user: IUser
}

export function YoutubePost(props: IYoutubePostProps) {
  const { post } = props
  const [youtubeMeta, setYoutubeMeta] = useState<YoutubeMeta>()

  const fetchYoutubeMeta = useCallback(async (videoId: string) => {
    const _youtubeMeta: YoutubeMeta = await getYoutubeMeta(videoId)

    setYoutubeMeta(_youtubeMeta)
  }, [])

  const getVideoId = useCallback((link: string) => {
    if (link.includes('youtu.be')) {
      return link.split('https://youtu.be/')[1]
    }
    if (link.includes('watch?v=')) {
      return link.split('watch?v=')[1]
    }
  }, [])

  useEffect(() => {
    if (youtubeMeta && youtubeMeta.thumbnail_url) {
      Image.prefetch(youtubeMeta.thumbnail_url)
    }
  }, [youtubeMeta])

  useEffect(() => {
    const videoId = getVideoId(post.content)

    if (videoId) fetchYoutubeMeta(videoId)
  }, [fetchYoutubeMeta, getVideoId, post])

  return (
    <DiscoverPost {...props}>
      <ImageBackground
        source={{ uri: youtubeMeta?.thumbnail_url }}
        style={YoutubePostComponentStyles.imageBackground}
        imageStyle={YoutubePostComponentStyles.imageBackgroundImage}
      >
        <Icon name="play-circle" size={45} color="#fff" />
      </ImageBackground>

      <View row bg-surfaceBG style={{ padding: 10, width: '100%' }}>
        <Youtube width={34} height={24} />
        <View marginL-20>
          <Text textColor bold text>
            {youtubeMeta?.title}
          </Text>
          <Text text50R text greyText>
            {post.content}
          </Text>
        </View>
      </View>
    </DiscoverPost>
  )
}
