import { useLazyQuery } from '@apollo/client'
import { map } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import FastImage from 'react-native-fast-image'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { Surface } from '../Surface/Surface.component'
import {
  FETCH_TWITTER_POST,
  IFetchTwitterPostResponse,
  IFetchTwitterPostVariables,
} from './queries/GetTwitterPost.query'

interface IProps {
  twitterUrl: string
}

export function TwitterPost(props: IProps) {
  const { twitterUrl } = props
  const [twitterId, setTwitterId] = useState<string>('')
  const [fetchTwitterPost, twitterPost] = useLazyQuery<
    IFetchTwitterPostResponse,
    IFetchTwitterPostVariables
  >(FETCH_TWITTER_POST)
  const twitterUsername = useMemo(
    () => twitterPost.data?.getTwitterPost.includes.users[0].username,
    [twitterPost],
  )
  const twitterName = useMemo(
    () => twitterPost.data?.getTwitterPost.includes.users[0].name,
    [twitterPost],
  )
  const twitterProfilePicutre = useMemo(
    () => twitterPost.data?.getTwitterPost.includes.users[0].profile_image_url,
    [twitterPost],
  )
  const twitterMedias = useMemo(
    () => twitterPost.data?.getTwitterPost.includes.media,
    [twitterPost],
  )
  const twitterText = useMemo(
    () => twitterPost.data?.getTwitterPost.data[0].text,
    [twitterPost],
  )

  useEffect(() => {
    if (twitterId)
      fetchTwitterPost({
        variables: {
          twitterId,
        },
      })
  }, [twitterId, fetchTwitterPost])

  useEffect(() => {
    const url = twitterUrl
    const regex = /twitter\.com\/(?:[^\/]+\/status\/)?(\d+)/
    const match = url.match(regex)
    console.log(match)
    if (match) {
      setTwitterId(match[1])
    }
  }, [twitterUrl])

  return (
    <Surface padding-10>
      <View row>
        <FastImage
          source={{
            uri: twitterProfilePicutre,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <TouchableOpacity onPress={() => null}>
          <View marginL-10>
            <Text text50R text textColor>
              {twitterName}
            </Text>
            <Text greyText text>
              @{twitterUsername}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text textColor marginV-10 fontGilroy>
        {twitterText}
      </Text>

      {map(twitterMedias, media => (
        <FastImage
          source={{ uri: media.url }}
          style={{
            width: 150,
            height: 100,
            borderRadius: 4,
            marginTop: 20,
            marginRight: 10,
          }}
        />
      ))}
    </Surface>
  )
}
