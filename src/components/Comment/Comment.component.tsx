import { updateAnsweringParent } from '@/store/reducers/comment.reducer'
import type { IComment } from '@/Types/comment.types'
import * as dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { map } from 'lodash'
import React, { useCallback, useState } from 'react'
import { Colors } from 'react-native-ui-lib'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import { Avatar } from '../Avatar/Avatar.component'
import { Icon } from '../Icon/Icon.component'

export interface ICommentProps {
  parentComments?: IComment[]
  content: string
  username: string
  likeCount: number
  date: Date
  avatar: string
  onPressAnswer: () => void
  onPressLike: (commentId?: number) => void
  onPressUnlike: (commentId?: number) => void
  isLiked: boolean
  showLikeButton: boolean
}

var customParseFormat = require('dayjs/plugin/customParseFormat')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.locale('tr')
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export function Comment(props: ICommentProps) {
  const {
    content,
    date,
    likeCount,
    username,
    parentComments,
    onPressAnswer,
    avatar,
    isLiked,
    onPressLike,
    onPressUnlike,
  } = props
  const [showParentComments, setShowParentComments] = useState<number[]>([])
  const dispatch = useDispatch()
  const _showParentComments = useCallback(
    (commentId: number) => {
      setShowParentComments([...showParentComments, commentId])
    },
    [showParentComments],
  )

  const parentOnPressAnswer = useCallback(
    (commentId: number) => {
      dispatch(updateAnsweringParent(commentId))
    },
    [dispatch],
  )
  const parentOnPressLike = useCallback(
    (commentId: number) => {
      onPressLike(commentId)
    },
    [onPressLike],
  )
  const parentOnPressUnlike = useCallback(
    (commentId: number) => {
      onPressUnlike(commentId)
    },
    [onPressUnlike],
  )

  const renderParentComments = useCallback(() => {
    if (parentComments) {
      let mostLikedComment: IComment
      if (parentComments.length > 1) {
        mostLikedComment = parentComments.reduce(
          (previousValue, currentValue) => {
            if (
              currentValue.postLike.likeCount > previousValue.postLike.likeCount
            ) {
              return currentValue
            }

            return previousValue
          },
        )
      }

      if (
        parentComments.length > 2 &&
        !showParentComments?.includes(parentComments[0].id)
      ) {
        return (
          <View marginL-30>
            <TouchableOpacity
              onPress={() => _showParentComments(parentComments[0].id)}
            >
              <View row marginL-15 marginT-10>
                <Text greyText>_____</Text>
                <Text paddingT-10 greyText bold marginT-5 marginL-10>
                  Yanıtları göster
                </Text>
              </View>
            </TouchableOpacity>
            <Comment
              content={mostLikedComment.content}
              date={mostLikedComment.created_at}
              likeCount={mostLikedComment.postLike.likeCount}
              username={mostLikedComment.user.username}
              onPressAnswer={() => parentOnPressAnswer(mostLikedComment.id)}
              avatar={mostLikedComment.user.avatar}
              onPressLike={() => parentOnPressLike(mostLikedComment.id)}
              onPressUnlike={() => parentOnPressUnlike(mostLikedComment.id)}
              isLiked={mostLikedComment?.userLike?.liked ?? false}
            />
          </View>
        )
      } else {
        return (
          <View marginL-30>
            {parentComments.length > 2 ? (
              <TouchableOpacity onPress={() => setShowParentComments([])}>
                <View row marginL-15 marginT-10>
                  <Text greyText>_____</Text>
                  <Text paddingT-10 greyText bold marginT-5 marginL-10>
                    Yanıtları gizle
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {map(parentComments, comment => (
              <Comment
                content={comment.content}
                date={comment.created_at}
                likeCount={comment.postLike.likeCount}
                username={comment.user.username}
                parentComments={comment?.parentComments}
                avatar={comment.user.avatar}
                onPressAnswer={() => parentOnPressAnswer(comment.id)}
                onPressLike={() => parentOnPressLike(comment.id)}
                onPressUnlike={() => parentOnPressUnlike(comment.id)}
                isLiked={comment?.userLike?.liked ?? false}
              />
            ))}
          </View>
        )
      }
    }

    return null
  }, [
    parentComments,
    _showParentComments,
    showParentComments,
    parentOnPressAnswer,
    parentOnPressLike,
    parentOnPressUnlike,
  ])

  return (
    <>
      <View marginV-5>
        <View row marginT-20 style={{ justifyContent: 'space-between' }}>
          <View row>
            <Avatar userAvatar={avatar} />
            <View marginL-10 row>
              <Text bold textColor>
                @{username}{' '}
              </Text>
              <Text textColor style={{ fontWeight: '400', maxWidth: '65%' }}>
                {content}
              </Text>
            </View>
          </View>

          {props.showLikeButton && (
            <TouchableOpacity
              onPress={!isLiked ? () => onPressLike() : () => onPressUnlike()}
            >
              <Icon
                name={isLiked ? 'heart-filled' : 'heart'}
                color={isLiked ? Colors.red30 : ''}
              />
            </TouchableOpacity>
          )}
        </View>

        <View row spread marginL-45>
          <Text greyText bold>
            {/* @ts-ignore */}

            {dayjs.default(date).fromNow()}
          </Text>
          <Text greyText bold>
            {likeCount} beğenme
          </Text>
          <TouchableOpacity onPress={onPressAnswer}>
            <Text greyText bold>
              Yanıtla
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderParentComments()}
    </>
  )
}
