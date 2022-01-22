import { Avatar } from '@/components/Avatar/Avatar.component'
import { IPostActionsProps } from '@/components/Post/Post.props'
import { PostActions } from '@/components/Post/PostActions.component'
import { IUser } from '@/types/login.types'
import { IPost } from '@/types/post.types'
import React from 'react'
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
}

export function DiscoverPost(props: IDiscoverPostProps) {
  const { post, user, onPressComment, onPressLike, onPressSave } = props

  return (
    <View>
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

        <Button
          primary
          outline
          outlineColor={Colors.primary}
          label="Takip et"
          style={{ height: 26, width: 120 }}
          avoidInnerPadding
          labelStyle={{ ...Typography.font12 }}
        />
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
          isLiked={post?.userLike?.liked}
          showDate
          date={post.created_at}
          onPressComment={onPressComment}
          onPressLike={onPressLike}
          onPressSave={onPressSave}
        />
      </View>
    </View>
  )
}