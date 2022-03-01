import { IFetchRoomMessagesResponse } from '@/graphql/queries/FetchMessages.query'
import { ApolloQueryResult } from '@apollo/client'
import {
  IChatty,
  IMessage,
} from 'react-native-chatty/lib/typescript/src/types/Chatty.types'

export interface IChatProps
  extends Pick<
    IChatty,
    'loadEarlierProps' | 'onReply' | 'bubbleProps' | 'replyingTo'
  > {
  callFunction: boolean
  username: string
  userId: number
  isOnline: boolean
  inCall?: boolean
  muted?: boolean
  isSpeaker?: boolean
  calling?: boolean
  typing: boolean
  avatar: string
  messages: IMessage[]
  renderItem?: (props: any) => any
  onPressCall?: () => void
  onPressMute?: () => void
  onPressSpeakers?: () => void
  onPressHangup?: () => void
  onPressCancelCall?: () => void
  onPressBack: () => void
  onPressRemove: (messageId: number) => void
  onPressSend: () => void
  onChangeInputText: (value: string) => void
  onBlurInput: () => void
  onTopReached?: () =>
    | Promise<ApolloQueryResult<IFetchRoomMessagesResponse>>
    | undefined
}
