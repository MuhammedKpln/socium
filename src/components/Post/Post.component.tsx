import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { PostType } from '@/types/post.types'
import { IInstagramMeta } from '@/types/socialMedia.types'
import { authRequiredFunction } from '@/utils/auth'
import { useLazyQuery } from '@apollo/client'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { map } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { Colors } from 'react-native-ui-lib'
import Image from 'react-native-ui-lib/image'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { Avatar } from '../Avatar/Avatar.component'
import { Icon } from '../Icon/Icon.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'
import { Surface } from '../Surface/Surface.component'
import {
  FETCH_TWITTER_POST,
  IFetchTwitterPostResponse,
  IFetchTwitterPostVariables,
} from '../TwitterPost/queries/GetTwitterPost.query'
import { IPostProps } from './Post.props'
import { PostActions } from './PostActions.component'

var customParseFormat = require('dayjs/plugin/customParseFormat')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.locale('tr')
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export const Post = React.memo((props: IPostProps) => {
  const [instagramThumbnailUrl, setInstagramThumbnailUrl] = useState<string>('')
  const {
    content,
    commentsCount,
    date,
    isLiked,
    likesCount,
    onPressComment,
    onPressLike,
    onPressPost,
    onPressSave,
    postType,
    user,
    additional,
  } = props
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)
  const [fetchTwitter, fetchTwitterMeta] = useLazyQuery<
    IFetchTwitterPostResponse,
    IFetchTwitterPostVariables
  >(FETCH_TWITTER_POST)
  const twitterImages = useMemo(() => {
    if (fetchTwitterMeta.data?.getTwitterPost?.includes.media) {
      return fetchTwitterMeta.data?.getTwitterPost?.includes.media
    }

    return []
  }, [fetchTwitterMeta])

  const fetchInstagramPost = useCallback(async () => {
    const url = `https://api.instagram.com/oembed/?url=${additional}`
    const response = await fetch(url)
    const data: IInstagramMeta = await response.json()

    setInstagramThumbnailUrl(data.thumbnail_url)
  }, [additional])

  const fetchTwitterPost = useCallback(async () => {
    const url = additional
    const regex = /twitter\.com\/(?:[^\/]+\/status\/)?(\d+)/

    if (!url) return
    const match = url.match(regex)

    if (match) {
      fetchTwitter({
        variables: {
          twitterId: match[1],
        },
      })
    }
  }, [additional, fetchTwitter])

  useEffect(() => {
    if (postType === PostType.Instagram) {
      fetchInstagramPost()
    }
    if (postType === PostType.Twitter) {
      fetchTwitterPost()
    }
  }, [fetchInstagramPost, postType, fetchTwitterPost])

  const _onPressPost = () => {
    if (isLoggedIn) {
      return onPressPost()
    }

    return navigate(Routes.Login, {})
  }

  const onPressUsername = () => {
    navigate(Routes.MyProfile, {
      username: user.username,
      userId: user.id,
    })
  }

  const renderYoutubeIframe = (postContent: string) => {
    const YoutubePlayer =
      require('@/components/YoutubePlayer/YoutubePlayer.component').YTPlayer
    let videoId: string = ''

    if (postContent.includes('youtu.be')) {
      videoId = postContent.split('https://youtu.be/')[1]
    }
    if (postContent.includes('watch?v=')) {
      videoId = postContent.split('watch?v=')[1]
    }

    return <YoutubePlayer videoId={videoId} />
  }

  return (
    <TouchableOpacity
      onPress={_onPressPost}
      style={{
        marginVertical: 10,
      }}
    >
      <View row>
        <View marginR-10>
          {user.avatar ? (
            <Avatar userAvatar={user?.avatar} size={40} />
          ) : (
            <NoAvatar username={user.username} size={32} />
          )}
        </View>
        <Surface padding-10 br20 width="100%">
          <View row spread width="85%">
            <View row>
              <TouchableOpacity
                onPress={() => authRequiredFunction(onPressUsername)}
              >
                <View row marginL-10>
                  <Text text50R text textColor>
                    {user.username}
                  </Text>
                  <Text greyText text marginL-7 marginT-6>
                    @{user.username}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View row style={{ marginTop: 7 }}>
              <Icon
                name="clock"
                color={Colors.greyText}
                style={{ color: '#fff', marginRight: 10 }}
              />
              <Text greyText text style={{ marginTop: -2 }}>
                {dayjs(date).fromNow()}
              </Text>
            </View>
          </View>

          <View margin-10>
            <Text document textColor style={{ lineHeight: 17 }}>
              {content}
            </Text>

            {postType === PostType.Instagram ? (
              <View row>
                <Image
                  source={{ uri: instagramThumbnailUrl }}
                  overlayColor="#000"
                  overlayType={Image.overlayTypes.BOTTOM}
                  overlayIntensity={Image.overlayIntensityType.MEDIUM}
                  style={{
                    width: 150,
                    height: 100,
                    borderRadius: 4,
                    marginTop: 20,
                    marginRight: 10,
                  }}
                />
              </View>
            ) : null}
            {postType === PostType.Twitter ? (
              <View row>
                {map(twitterImages.slice(0, 2), (media, index) => {
                  if (index === 1) {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          navigate(Routes.ImageGallery, {
                            imageSet: [...map(twitterImages, _ => _.url)],
                          })
                        }
                        key={index}
                      >
                        <ImageBackground
                          source={{ uri: media.url }}
                          style={{
                            width: 100,
                            height: 50,
                            borderRadius: 4,
                            marginTop: 20,
                            marginRight: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text fontGilroyBold white>
                            {twitterImages.length !== 2
                              ? twitterImages.length - 2
                              : ''}
                          </Text>
                          <View
                            style={{
                              ...StyleSheet.absoluteFillObject,
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }}
                          ></View>
                        </ImageBackground>
                      </TouchableOpacity>
                    )
                  }

                  return (
                    <Image
                      source={{
                        uri: media.url,
                      }}
                      key={index}
                      overlayColor="#000"
                      overlayType={Image.overlayTypes.BOTTOM}
                      overlayIntensity={Image.overlayIntensityType.MEDIUM}
                      style={{
                        width: 100,
                        height: 50,
                        borderRadius: 4,
                        marginTop: 20,
                        marginRight: 10,
                      }}
                    />
                  )
                })}
              </View>
            ) : null}
            {postType === PostType.Youtube ? (
              <View>{renderYoutubeIframe(additional ? additional : '')}</View>
            ) : null}
          </View>
          <View width="85%">
            <PostActions
              commentsCount={commentsCount.toString()}
              isLiked={isLiked}
              likesCount={likesCount.toString()}
              onPressComment={() => authRequiredFunction(onPressComment)}
              onPressLike={() => authRequiredFunction(onPressLike)}
              onPressSave={() => authRequiredFunction(onPressSave)}
            />
          </View>
        </Surface>
      </View>
    </TouchableOpacity>
  )
})
