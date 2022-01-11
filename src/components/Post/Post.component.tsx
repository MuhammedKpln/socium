import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { PostType } from '@/types/post.types'
import { IInstagramMeta } from '@/types/socialMedia.types'
import * as dayjs from 'dayjs'
import 'dayjs/locale/tr'
import React, { useCallback, useEffect, useState } from 'react'
import { Colors } from 'react-native-ui-lib'
import Image from 'react-native-ui-lib/image'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { Avatar } from '../Avatar/Avatar.component'
import { Icon } from '../Icon/Icon.component'
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'
import { Surface } from '../Surface/Surface.component'
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
    title,
    user,
  } = props
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)

  const fetchInstagramPost = useCallback(async () => {
    const url = `https://api.instagram.com/oembed/?url=${title}`
    const response = await fetch(url)
    const data: IInstagramMeta = await response.json()

    setInstagramThumbnailUrl(data.thumbnail_url)
  }, [title])

  useEffect(() => {
    if (postType === PostType.Instagram) {
      fetchInstagramPost()
    }
  }, [fetchInstagramPost, postType])

  const _onPressPost = () => {
    if (isLoggedIn) {
      return onPressPost()
    }

    return navigate(Routes.Login, {})
  }

  const _onPressLike = () => {
    if (isLoggedIn) {
      return onPressLike()
    }

    return navigate(Routes.Login, {})
  }

  const _onPressComment = () => {
    if (isLoggedIn) {
      return onPressComment()
    }

    return navigate(Routes.Login, {})
  }

  const onPressUsername = () => {
    navigate(Routes.Profile, {
      username: user.username,
      userId: user.id,
    })
  }
  const _onPressSave = () => {
    if (isLoggedIn) {
      return onPressSave()
    }

    return navigate(Routes.Login, {})
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
      <>
        <Surface padding-20 width="100%" br20>
          <View row spread>
            <View row left>
              {user.avatar ? (
                <Avatar userAvatar={user?.avatar} />
              ) : (
                <NoAvatar username={user.username} />
              )}
              <TouchableOpacity onPress={onPressUsername}>
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
            <View row right style={{ marginTop: 7 }}>
              <Icon
                name="clock"
                color={Colors.greyText}
                style={{ color: '#fff', marginRight: 10 }}
              />
              <Text greyText text marginL-5 style={{ marginTop: -2 }}>
                {/* @ts-ignore */}
                {dayjs.default(date).fromNow()}
              </Text>
            </View>
          </View>

          <View margin-5>
            <Text document textColor style={{ lineHeight: 17 }}>
              {postType === PostType.Content ? (
                <MarkdownRenderer>{content}</MarkdownRenderer>
              ) : null}
              {postType !== PostType.Content ? content : null}
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
            {postType === PostType.Youtube ? (
              <View>{renderYoutubeIframe(content)}</View>
            ) : null}
          </View>
          <PostActions
            commentsCount={commentsCount.toString()}
            isLiked={isLiked}
            likesCount={likesCount.toString()}
            onPressComment={_onPressComment}
            onPressLike={_onPressLike}
            onPressSave={_onPressSave}
          />
        </Surface>
      </>
    </TouchableOpacity>
  )
})
