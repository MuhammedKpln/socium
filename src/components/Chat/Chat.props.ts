import { IFetchRoomMessagesResponse } from '@/graphql/queries/FetchMessages.query'
import { ApolloQueryResult } from '@apollo/client'

export interface IChatProps {
  callFunction: boolean
  username: string
  userId: number
  message: string
  isOnline: boolean
  inCall?: boolean
  muted?: boolean
  isSpeaker?: boolean
  calling?: boolean
  typing: boolean
  avatar: string
  messages: any[]
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
