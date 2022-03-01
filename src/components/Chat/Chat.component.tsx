import { showToast, ToastStatus } from '@/utils/toast'
import Clipboard from '@react-native-community/clipboard'
import 'dayjs/locale/tr'
import React, { Ref, useEffect } from 'react'
import { ChatEmitter, Chatty } from 'react-native-chatty'
import type { ListRef } from 'react-native-chatty/lib/typescript/src/types/Chatty.types'
import { Button, Colors } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { Icon } from '../Icon/Icon.component'
import type { IChatProps } from './Chat.props'
import { ChatBubble } from './ChatBubble.component'
import { ChatHeader } from './ChatHeader.component'

function _ChatComponent(props: IChatProps, ref: Ref<ListRef>) {
  useEffect(() => {
    ChatEmitter.addListener('actionPressed', (index, message) => {
      switch (index) {
        case 0:
          showToast(ToastStatus.Success, 'Mesajınız kopyalandı')
          Clipboard.setString(message.text)
          break
        case 1:
          props.onPressRemove(message.id)
          break
      }
    })

    return () => {
      ChatEmitter.removeAllListeners()
    }
  }, [props])

  return (
    <View bg-surfaceBG style={{ minWidth: 1, minHeight: 1 }}>
      <Chatty
        ref={ref}
        messages={props.messages}
        enableHapticFeedback
        patternProps={{
          allowPatterns: ['mention'],
        }}
        setDateLocale="tr"
        renderHeader={() => (
          <ChatHeader
            avatar={props.avatar}
            callFunction={false}
            isOnline
            username={props.username}
            onPressBack={props.onPressBack}
            inCall={props.inCall}
            muted={props.muted}
            onPressCall={props.onPressCall}
          />
        )}
        headerProps={{
          user: {
            id: props.userId,
            avatar: { uri: props.avatar },
            username: props.username,
          },
        }}
        scrollToBottomProps={{
          containerStyle: {
            position: 'absolute',
            bottom: 50,
            right: 20,
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: Colors.primary,
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: <Icon name="chevrons-down" color="#fff" size={20} />,
        }}
        footerProps={{
          onChangeText: props.onChangeInputText,
          onPressSend: props.onPressSend,
          onPressCancelReply: () => props?.onReply!(null),
          inputStyle: {
            width: '85%',
            backgroundColor: Colors.surfaceBG,
            borderRadius: 100,
            borderColor: Colors.getScheme() === 'dark' ? '#ADADAD' : '#FAFAFC',
            borderWidth: 1,
          },
          replyStyles: {
            containerStyle: {
              borderLeftColor: Colors.primary,
            },
          },
          sendButton: _props => {
            return (
              <Button
                padding-10
                onPress={_props?.onPressSend}
                iconSource={() => (
                  <Icon name="PaperPlane" size={20} color={Colors.white} />
                )}
              />
            )
          },
          closeReplyButton: _props => (
            <Button
              onPress={_props?.onPressCancelReply}
              padding-10
              iconSource={() => <Icon name="trash" size={20} color="#fff" />}
            />
          ),
        }}
        renderTypingBubble={_props => (
          <ChatBubble customElement={_props?.typingAnimation} />
        )}
        loadEarlierProps={props.loadEarlierProps}
        showScrollToBottomButton
        onReply={props.onReply}
        replyingTo={props.replyingTo}
        bubbleProps={{
          replyDragElement: (
            <Icon
              name="reply"
              color="#000"
              size={20}
              style={{ alignSelf: 'center', marginLeft: 10 }}
            />
          ),
          selfBubbleColor: Colors.primary,
          otherBubbleColor: Colors.white,
          containerStyle: {
            borderRadius: 10,
          },
          labelStyle(isSelf) {
            if (isSelf) {
              return {
                color: '#fff',
              }
            } else {
              return {
                color: '#000',
              }
            }
          },
          dateStyle(isSelf) {
            if (isSelf) {
              return {
                color: '#fff',
              }
            } else {
              return {
                color: '#000',
              }
            }
          },
          actions: {
            options: [
              {
                title: 'Kopyala',
                systemIcon: 'doc.on.doc',
              },
              {
                title: 'Mesajı geri çek',
                systemIcon: 'trash',
                destructive: true,
              },
            ],
            cancelButtonLabel: 'İptal',
          },
        }}
        listProps={{
          containerStyle: {
            backgroundColor: Colors.surfaceBG,
          },
        }}
      />
    </View>
  )
}

export const ChatComponent = React.forwardRef(_ChatComponent)
