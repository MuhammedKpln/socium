import React from 'react'
import { Colors } from 'react-native-ui-lib'
import Button from 'react-native-ui-lib/button'
import View from 'react-native-ui-lib/view'
import Text from 'react-native-ui-lib/text'
import { Icon } from '../Icon/Icon.component'
import { IPostActionsProps } from './Post.props'

export function PostActions(props: IPostActionsProps) {
  const {
    commentsCount,
    isLiked,
    likesCount,
    loading,
    onPressComment,
    onPressLike,
    onPressSave,
    showDate,
    date,
  } = props

  return (
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
          onPress={onPressLike}
          labelStyle={{
            color: '#7F8386',
            marginLeft: 10,
          }}
          disabled={loading}
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

      {!showDate ? (
        <Button
          iconSource={() => <Icon name="bookmark" size={16} />}
          link
          text
          onPress={onPressSave}
        />
      ) : (
        <View row marginT-5>
          <Icon name="clock" color={Colors.greyText} />
          <Text greyText text marginL-5 style={{ marginTop: -2 }}>
            {date}
          </Text>
        </View>
      )}
    </View>
  )
}
