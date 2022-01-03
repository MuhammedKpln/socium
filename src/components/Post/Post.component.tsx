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
import Button from '../Button/Button.component'
import { Icon } from '../Icon/Icon.component'
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'
import { Surface } from '../Surface/Surface.component'
import { IPostProps } from './Post.props'

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
    postType,
    title,
    user,
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

  return (
    <TouchableOpacity onPress={_onPressPost}>
      <View row marginV-20>
        <NoAvatar username="awd" />

        <Surface
          width="100%"
          padding-10
          style={{ borderRadius: 6, flexWrap: 'wrap' }}
        >
          <View style={{ minWidth: '90%', maxWidth: '91%' }}>
            <View row spread>
              <TouchableOpacity onPress={onPressUsername}>
                <View row>
                  <Text text50R text>
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
              <Text document style={{ lineHeight: 17 }}>
                {postType === PostType.Content ? (
                  <MarkdownRenderer>{content}</MarkdownRenderer>
                ) : null}
                {postType !== PostType.Content ? content : null}
              </Text>

              <View row>
                {typeof title === 'string' &&
                postType === PostType.Instagram ? (
                  <FastImage
                    source={{ uri: title }}
                    style={{
                      width: 94,
                      height: 63,
                      borderRadius: 4,
                      marginTop: 20,
                      marginRight: 10,
                    }}
                  />
                ) : null}
              </View>

              <View row spread marginT-20>
                <View row>
                  <Button
                    iconSource={() =>
                      !isLiked ? (
                        <Icon name="heart" size={14} color="#7F8386" />
                      ) : (
                        <Icon name="heart-filled" size={14} color="#FD5D5D" />
                      )
                    }
                    label={likesCount.toString()}
                    link
                    text
                    onPress={_onPressLike}
                    labelStyle={{
                      color: '#7F8386',
                      marginLeft: 10,
                    }}
                  />
                  <View
                    marginH-40
                    style={{ borderColor: '#E0E0E0', borderWidth: 0.5 }}
                  />
                  <Button
                    onPress={_onPressComment}
                    iconSource={() => (
                      <Icon name="comment" size={14} color="#7F8386" />
                    )}
                    label={commentsCount.toString()}
                    link
                    text
                    labelStyle={{ color: '#7F8386', marginLeft: 10 }}
                  />
                </View>
                <Button
                  iconSource={() => <Icon name="bookmark" size={16} />}
                  link
                  text
                />
              </View>
            </View>
          </View>
        </Surface>
      </View>
    </TouchableOpacity>
  )
})
