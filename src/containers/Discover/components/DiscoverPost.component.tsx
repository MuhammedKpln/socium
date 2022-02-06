import { Avatar } from '@/components/Avatar/Avatar.component'
import { IPostActionsProps } from '@/components/Post/Post.props'
import { PostActions } from '@/components/Post/PostActions.component'
import { Routes } from '@/navigators/navigator.props'
import { useAppSelector } from '@/store'
import { IUser } from '@/types/login.types'
import { IPost } from '@/types/post.types'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useCallback } from 'react'
import { Colors, Typography } from 'react-native-ui-lib'
import Button from 'react-native-ui-lib/button'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'

export interface IDiscoverPostProps
  extends Pick<
    IPostActionsProps,
    'onPressLike' | ('onPressComment' | 'onPressSave' | 'isLiked')
  > {
  post: IPost
  user: IUser
  children?: React.ReactNode
  onPressFollow?: () => void
  onPressUnfollow?: () => void
  isFollowed?: boolean
}

export function DiscoverPost(props: IDiscoverPostProps) {
  const localUser = useAppSelector(state => state.userReducer.user)
  const navigation = useNavigation()
  const {
    post,
    user,
    onPressComment,
    onPressLike,
    onPressSave,
    onPressFollow,
    onPressUnfollow,
  } = props

  const onPressPost = useCallback(() => {
    navigation.navigate(Routes.PostDetails, { postId: post.id })
  }, [navigation, post.id])

  return (
    <TouchableOpacity onPress={onPressPost}>
      <View row spread>
        <View row>
          <Avatar userAvatar={user?.avatar} />
          <TouchableOpacity onPress={() => null}>
            <View marginL-10>
              <Text text50R text textColor>
                {user.username}
              </Text>
              <Text greyText text>
                @{user.username}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {localUser?.id !== user.id && (
          <Button
            primary={!props.isFollowed}
            outline={!props.isFollowed}
            outlineColor={Colors.primary}
            label={props.isFollowed ? 'Takipten çık' : 'Takip et'}
            onPress={!props.isFollowed ? onPressFollow : onPressUnfollow}
            style={{ height: 26, width: 120 }}
            avoidInnerPadding
            labelStyle={{ ...Typography.font12 }}
          />
        )}
      </View>

      <View marginV-15>
        <View>{props.children ? props.children : null}</View>

        <View>
          <Text textColor text marginT-10>
            @{user.username}
            {'  '}
            <Text greyText>{post.content}</Text>
          </Text>
        </View>
        <PostActions
          commentsCount={post._count.comment.toString()}
          likesCount={post.postLike.likeCount.toString()}
          isLiked={post?.userLike?.liked ?? false}
          showDate
          date={post.created_at}
          onPressComment={onPressComment}
          onPressLike={onPressLike}
          onPressSave={onPressSave}
        />
      </View>
    </TouchableOpacity>
  )
}
