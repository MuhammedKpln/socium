import { useAppSelector } from '@/store'
import { IMessage } from '@/types/messages.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { wait } from '@/utils/utils'
import AnimatedLottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { Assets, Colors, Incubator, View } from 'react-native-ui-lib'
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview'
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView'
import { Icon } from '../Icon/Icon.component'
import { IChatProps } from './Chat.props'
import { ChatBubble } from './ChatBubble.component'
import { ChatHeader } from './ChatHeader.component'

const { TextField } = Incubator

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 5,
}

function _ChatComponent(props: IChatProps, ref: any) {
  const localUser = useAppSelector(state => state.userReducer.user)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    wait(250).then(() => ref.current?.scrollToEnd())
  }, [ref])

  useEffect(() => {
    if (loading) {
      showToast(ToastStatus.Info, 'Eski mesajlar yükleniyor...', {
        showLoader: true,
      })
    }
  }, [loading])

  const dataProvider = useCallback(() => {
    return new DataProvider((r1: IMessage, r2: IMessage) => {
      return r1.id !== r2.id
    })
  }, [])
  const layoutProvider = useCallback(() => {
    return new LayoutProvider(
      () => {
        return ViewTypes.FULL
      },
      (type, dim) => {
        let { width } = Dimensions.get('window')

        switch (type) {
          case ViewTypes.HALF_LEFT:
            dim.width = width / 2 - 0.0001
            dim.height = 160
            break
          case ViewTypes.HALF_RIGHT:
            dim.width = width / 2
            dim.height = 200
            break
          case ViewTypes.FULL:
            dim.width = width
            dim.height = 110
            break
          default:
            dim.width = 0
            dim.height = 0
        }
      },
    )
  }, [])
  const rowRenderer = useCallback(
    (type, data: IMessage) => {
      const isSelf = data?.sender?.id === localUser?.id
      switch (type) {
        case ViewTypes.FULL:
          return (
            <ChatBubble
              message={data.message}
              isSelf={isSelf}
              createdAt={data.created_at}
            />
          )

        default:
          return null
      }
    },
    [localUser],
  )

  const Footer = React.memo(() => {
    return (
      <TextField
        placeholder="Mesaj gönderin"
        padding-10
        containerStyle={{
          padding: 10,
        }}
        fieldStyle={{
          backgroundColor: Colors.surfaceBG,
          borderRadius: 100,
          borderColor: Colors.getScheme() === 'dark' ? '#ADADAD' : '#FAFAFC',
          borderWidth: 1,
        }}
        onChangeText={props.onChangeInputText}
        placeholderTextColor="#ADADAD"
        trailingAccessory={
          <View bg-primary padding-10 br100>
            <Icon
              name="PaperPlane"
              size={25}
              color={Colors.white}
              onPress={props.onPressSend}
            />
          </View>
        }
      />
    )
  })

  const onTopReached = useCallback(
    (e: ScrollEvent) => {
      if (e.nativeEvent.contentOffset.y === 0) {
        if (props?.onTopReached) {
          setLoading(true)
          props.onTopReached()?.finally(() => setLoading(false))
        }
      }
    },
    [props],
  )

  const onTyping = useCallback(() => {
    if (props.typing) {
      return (
        <ChatBubble
          customElement={
            <AnimatedLottieView
              source={Assets.animations.typing}
              loop
              autoPlay
            />
          }
        />
      )
    }

    return null
  }, [props.typing])

  return (
    <View bg-surfaceBG>
      <ChatHeader status={props.isOnline} {...props} />

      <View>
        <RecyclerListView
          rowRenderer={rowRenderer}
          layoutProvider={layoutProvider()}
          dataProvider={dataProvider().cloneWithRows(props.messages)}
          onItemLayout={e => console.log(e)}
          onScroll={onTopReached}
          renderFooter={onTyping}
          style={{
            height: '79%',
            backgroundColor: Colors.surfaceBG,
          }}
          ref={ref}
        />
      </View>
      <Footer />
    </View>
  )
}

export const ChatComponent = React.forwardRef(_ChatComponent)
