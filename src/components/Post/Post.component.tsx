import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { PostType } from '@/types/post.types'
import * as dayjs from 'dayjs'
import 'dayjs/locale/tr'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { Colors } from 'react-native-ui-lib'
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
    loading,
  } = props
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)

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
    <TouchableOpacity onPress={_onPressPost}>
      <View row marginV-20>
        {user.avatar ? (
          <Avatar userAvatar={user?.avatar} />
        ) : (
          <NoAvatar username={user.username} />
        )}

        <Surface
          width="100%"
          padding-10
          marginL-10
          style={{ borderRadius: 6, flexWrap: 'wrap' }}
        >
          <View style={{ minWidth: '90%', maxWidth: '91%' }}>
            <View row spread>
              <TouchableOpacity onPress={onPressUsername}>
                <View row>
                  <Text text50R text textColor>
                    {user.username}
                  </Text>
                  <Text greyText text marginL-7 marginT-6>
                    @{user.username}
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <Text greyText text marginT-6>
                  <Icon
                    name="clock"
                    color={Colors.greyText}
                    style={{ color: '#fff', marginRight: 10 }}
                  />
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

              {typeof title === 'string' && postType === PostType.Instagram ? (
                <View row>
                  <FastImage
                    source={{ uri: title }}
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
              loading={loading}
              onPressComment={_onPressComment}
              onPressLike={_onPressLike}
              onPressSave={_onPressSave}
            />
          </View>
        </Surface>
      </View>
    </TouchableOpacity>
  )
})
