import { IComment } from '@/Types/comment.types'
import * as dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { map } from 'lodash'
import React, { useCallback, useState } from 'react'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'
import { Icon } from '../Icon/Icon.component'
import { NoAvatar } from '../NoAvatar/NoAvatar.component'

export interface ICommentProps {
  parentComments?: IComment[]
  content: string
  username: string
  likeCount: number
  date: Date
}

var customParseFormat = require('dayjs/plugin/customParseFormat')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.locale('tr')
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export function Comment(props: ICommentProps) {
  const { content, date, likeCount, username, parentComments } = props
  const [showParentComments, setShowParentComments] = useState<number[]>([])

  const _showParentComments = useCallback(
    (commentId: number) => {
      setShowParentComments([...showParentComments, commentId])
    },
    [showParentComments],
  )

  const renderParentComments = useCallback(() => {
    if (parentComments) {
      const mostLikedComment = parentComments.reduce(
        (previousValue, currentValue) => {
          if (
            currentValue.postLike.likeCount > previousValue.postLike.likeCount
          ) {
            return currentValue
          }

          return previousValue
        },
      )

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
            />
          </View>
        )
      } else {
        return map(parentComments, comment => {
          return (
            <View marginL-30>
              <Comment
                content={comment.content}
                date={comment.created_at}
                likeCount={comment.postLike.likeCount}
                username={comment.user.username}
                parentComments={comment?.parentUser?.userParentComments}
              />
            </View>
          )
        })
      }
    }

    return null
  }, [parentComments, _showParentComments, showParentComments])

  return (
    <>
      <View marginV-5>
        <View spread row marginT-20>
          <View row left>
            <NoAvatar username="qwe" />
            <Text bold marginR-10 marginL-10 textColor>
              @{username}
            </Text>
            <Text textColor>{content}</Text>
          </View>
          <View right row>
            <Icon name="heart" />
          </View>
        </View>
        <View row spread marginL-45>
          <Text greyText bold>
            {/* @ts-ignore */}

            {dayjs.default(date).fromNow()}
          </Text>
          <Text greyText bold>
            {likeCount} beğenme
          </Text>
          <Text greyText bold>
            Yanitla
          </Text>
        </View>
      </View>

      {renderParentComments()}
    </>
  )
}
