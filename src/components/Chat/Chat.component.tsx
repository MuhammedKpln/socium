import { useAppSelector } from '@/store'
import { IMessage } from '@/types/messages.types'
import { showToast, ToastStatus } from '@/utils/toast'
import { wait } from '@/utils/utils'
import AnimatedLottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useMemo } from 'react'
import { Dimensions, Keyboard, useWindowDimensions } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Assets, Colors } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview'
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView'
import { Icon } from '../Icon/Icon.component'
import { KeyboardAvoidingView } from '../KeyboardAvoidingView/KeyboardAvoidingView.component'
import { IChatProps } from './Chat.props'
import { ChatBubble } from './ChatBubble.component'
import { ChatFooter } from './ChatFooter.component'
import { ChatHeader } from './ChatHeader.component'

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 5,
}

function _ChatComponent(props: IChatProps, ref: any) {
  const localUser = useAppSelector(state => state.userReducer.user)
  const [loading, setLoading] = useState(false)
  const dimensions = useWindowDimensions()
  const safearea = useSafeAreaInsets()
  const listHeight = useMemo(
    () => dimensions.height - 162 - safearea.bottom - safearea.top,
    [dimensions, safearea],
  )

  useEffect(() => {
    wait(250).then(() => ref.current?.scrollToEnd())
    const keyboardListener = Keyboard.addListener('keyboardDidShow', () => {
      if (ref.current.scrollToEnd) {
        ref.current.scrollToEnd({
          animated: true,
        })
      }
    })

    return () => {
      keyboardListener.remove()
    }
  }, [ref])

  useEffect(() => {
    ref.current.scrollToEnd({
      animated: true,
    })
  }, [ref, props.messages])

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
      const isSelf =
        data?.sender?.id === localUser?.id || data?.senderId === localUser?.id
      switch (type) {
        case ViewTypes.FULL:
          return (
            <Animated.View entering={FadeInDown}>
              <ChatBubble
                id={data.id}
                message={data.message}
                isSelf={isSelf}
                createdAt={data.created_at}
                onPressRemove={messageId => props.onPressRemove(messageId)}
              />
            </Animated.View>
          )

        default:
          return null
      }
    },
    [localUser, props],
  )

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
        <Animated.View entering={FadeInDown} exiting={FadeInDown}>
          <ChatBubble
            customElement={
              <AnimatedLottieView
                source={Assets.animations.typing}
                loop
                autoPlay
              />
            }
          />
        </Animated.View>
      )
    }

    return null
  }, [props.typing])

  return (
    <View bg-surfaceBG>
      <ChatHeader status={props.isOnline} {...props} />

      <KeyboardAvoidingView keyboardVerticalOffset={90}>
        <RecyclerListView
          rowRenderer={rowRenderer}
          layoutProvider={layoutProvider()}
          dataProvider={dataProvider().cloneWithRows(props.messages)}
          onItemLayout={e => console.log(e)}
          scrollViewProps={{
            invertStickyHeaders: true,
          }}
          onScroll={onTopReached}
          style={{
            backgroundColor: Colors.surfaceBG,
            height: listHeight,
          }}
          renderFooter={onTyping}
          ref={ref}
        />
        <ChatFooter {...props} />
      </KeyboardAvoidingView>
    </View>
  )
}

export const ChatComponent = React.forwardRef(_ChatComponent)
