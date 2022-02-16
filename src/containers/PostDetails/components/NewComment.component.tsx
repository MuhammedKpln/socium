import { Avatar } from '@/components/Avatar/Avatar.component'
import { Comment } from '@/components/Comment/Comment.component'
import { Icon } from '@/components/Icon/Icon.component'
import { Surface } from '@/components/Surface/Surface.component'
import { TextInput } from '@/components/TextInput/TextInput.component'
import {
  INewCommentResponse,
  INewCommentVariables,
  NEW_COMMENT,
} from '@/graphql/mutations/NewComment.mutation'
import { useAppSelector } from '@/store'
import {
  pushNewComment,
  updateAnsweringParent,
  updateParentComments,
} from '@/store/reducers/comment.reducer'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { Keyboard } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Colors, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'

interface IProps {
  postId?: number
  parentId?: number
}

export function NewComment(props: IProps) {
  const { postId, parentId } = props
  const [comment, setComment] = useState<string>('')
  const user = useAppSelector(state => state.userReducer.user)
  const isAnsweringParent = useAppSelector(
    state => state.commentReducer.isAnsweringParent,
  )
  const parentComment = useAppSelector(
    state =>
      state.commentReducer.comments.filter(v => v.id === isAnsweringParent)[0],
  )
  const dispatch = useDispatch()

  const [newComment] = useMutation<INewCommentResponse, INewCommentVariables>(
    NEW_COMMENT,
  )

  const onSubmit = useCallback(() => {
    newComment({
      variables: {
        parentId,
        postId,
        content: comment,
      },

      onCompleted: ({ newComment: cm }) => {
        showToast(ToastStatus.Success, 'Yorumunuz paylasildi')
        setComment('')
        Keyboard.dismiss()
        dispatch(updateAnsweringParent(null))

        if (isAnsweringParent) {
          dispatch(
            updateParentComments({
              parentId: isAnsweringParent,
              comment: cm,
            }),
          )
        } else {
          dispatch(pushNewComment(cm))
        }
      },
    })
  }, [comment, postId, newComment, parentId, isAnsweringParent, dispatch])

  const removeParentComment = useCallback(() => {
    dispatch(updateAnsweringParent(null))
  }, [dispatch])

  return (
    <View>
      {isAnsweringParent && parentComment ? (
        <TouchableOpacity onPress={removeParentComment}>
          <Surface br20 marginB-20 padding-10>
            <Animated.View entering={FadeInDown}>
              <Comment
                content={parentComment?.content}
                username={parentComment?.user.username}
                date={parentComment?.created_at}
                likeCount={parentComment?.postLike.likeCount}
                avatar={parentComment.user.avatar}
                onPressAnswer={() => null}
                parentComments={undefined}
                isLiked={parentComment?.userLike?.liked ?? false}
                onPressLike={() => null}
                onPressUnlike={() => null}
              />
            </Animated.View>
          </Surface>
        </TouchableOpacity>
      ) : null}

      <View row>
        <View marginR-20>
          <Avatar userAvatar={user ? user.avatar : ''} size={50} />
        </View>
        <TextInput
          value={comment}
          placeholder="Yorumunuzu yazin..."
          containerStyle={{ width: '80%' }}
          multiline
          trailingAccessory={
            <Icon
              name="send"
              size={20}
              color={Colors.primary}
              onPress={onSubmit}
            />
          }
          showCharCounter
          onChangeText={e => setComment(e)}
        />
      </View>
    </View>
  )
}
