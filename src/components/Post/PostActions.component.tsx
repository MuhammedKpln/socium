import React from 'react'
import { Colors } from 'react-native-ui-lib'
import Button from 'react-native-ui-lib/button'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { Icon } from '../Icon/Icon.component'
import { IPostActionsProps } from './Post.props'
import * as dayjs from 'dayjs'

var customParseFormat = require('dayjs/plugin/customParseFormat')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.locale('tr')
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export const PostActions = React.memo((props: IPostActionsProps) => {
  const {
    commentsCount,
    isLiked,
    likesCount,
    onPressComment,
    onPressLike,
    onPressSave,
    showDate,
    date,
  } = props

  return (
    <View row spread marginT-10 width="100%">
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
          onPress={onPressLike}
          delayPressOut={1000}
          labelStyle={{
            color: '#7F8386',
            marginLeft: 10,
          }}
        />
        <View marginH-40 style={{ borderColor: '#E0E0E0', borderWidth: 0.5 }} />
        <Button
          onPress={onPressComment}
          iconSource={() => <Icon name="comment" size={14} color="#7F8386" />}
          label={commentsCount.toString()}
          link
          text
          labelStyle={{ color: '#7F8386', marginLeft: 10 }}
        />
      </View>
      <View row marginT-5>
        {!showDate ? (
          <Button
            iconSource={() => <Icon name="bookmark" size={16} />}
            link
            text
            onPress={onPressSave}
          />
        ) : (
          <View row right>
            <Icon
              name="clock"
              color={Colors.greyText}
              style={{ marginRight: 5 }}
            />
            <Text greyText text style={{ marginTop: -2 }}>
              {/* @ts-ignore */}
              {dayjs.default(date).fromNow()}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
})
