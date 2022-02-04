import { Icon } from '@/components/Icon/Icon.component'
import {
  FETCH_TWITTER_POST,
  IFetchTwitterPostResponse,
  IFetchTwitterPostVariables,
} from '@/components/TwitterPost/queries/GetTwitterPost.query'
import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { ImageBackground } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
import { YoutubePostComponentStyles } from '../styles/YoutubePost.styles'
import { DiscoverPost, IDiscoverPostProps } from './DiscoverPost.component'

export interface ITwitterPost extends IDiscoverPostProps {}

export function TwitterPost(props: ITwitterPost) {
  const [fetchTwitter, fetchTwitterMeta] = useLazyQuery<
    IFetchTwitterPostResponse,
    IFetchTwitterPostVariables
  >(FETCH_TWITTER_POST, {})

  useEffect(() => {
    const url = props.post.additional

    if (!url) return

    const regex = /twitter\.com\/(?:[^\/]+\/status\/)?(\d+)/
    const match = url.match(regex)

    if (match) {
      fetchTwitter({
        variables: {
          twitterId: match[1],
        },
      })
    }
  }, [fetchTwitter, props.post.additional])

  return (
    <DiscoverPost {...props}>
      <ImageBackground
        source={{
          uri: fetchTwitterMeta?.data?.getTwitterPost?.includes?.media[0].url,
        }}
        style={YoutubePostComponentStyles.imageBackground}
        imageStyle={YoutubePostComponentStyles.imageBackgroundImage}
      ></ImageBackground>

      <View row bg-surfaceBG style={{ padding: 10, width: '100%' }}>
        <Icon name="twitter" color="#1DA1F2" size={25} />
        <View marginL-20>
          <Text textColor bold text>
            {fetchTwitterMeta?.data?.getTwitterPost?.data[0]?.text}
          </Text>
          <Text text50R text greyText>
            @
            {
              fetchTwitterMeta?.data?.getTwitterPost?.includes?.users[0]
                ?.username
            }
          </Text>
        </View>
      </View>
    </DiscoverPost>
  )
}
