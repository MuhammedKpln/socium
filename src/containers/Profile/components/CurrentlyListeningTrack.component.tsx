import { Icon } from '@/components/Icon/Icon.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import {
  GET_USER_CURRENT_TRACK,
  IFetchUserCurrentTrackResponse,
  IFetchUserCurrentTrackVariables,
} from '@/graphql/queries/GetUserCurrentTrack.query'
import { Routes } from '@/navigators/navigator.props'
import { useAppSelector } from '@/store'
import { useLazyQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  userId: number | undefined
}

export default function CurrentlyListeningTrack(props: IProps) {
  const { userId } = props
  const localUserId = useAppSelector(state => state.userReducer.user?.id)
  const navigation = useNavigation()

  const [fetchUserTrack, currentTrack] = useLazyQuery<
    IFetchUserCurrentTrackResponse,
    IFetchUserCurrentTrackVariables
  >(GET_USER_CURRENT_TRACK)

  useEffect(() => {
    if (!userId) return

    fetchUserTrack({ variables: { userId } })
  }, [userId, fetchUserTrack])

  const onPress = useCallback(() => {
    if (userId === localUserId) {
      navigation.navigate(Routes.ConnectToSpotify)
      return
    }

    return
  }, [localUserId, navigation, userId])

  if (!userId && currentTrack.loading)
    return <SkeletonView height={30} width={200} />

  if (!currentTrack.data?.getUserCurrentTrack) return null

  return (
    <TouchableOpacity onPress={onPress}>
      <View bg-green padding-10 row left br100 style={{ maxWidth: '50%' }}>
        <Icon name="spotify" color="#FFF" size={20} />
        <Text white center marginL-10 font15 fontSfProRegular>
          🎶 {currentTrack.data?.getUserCurrentTrack.songName} -{' '}
          {currentTrack.data?.getUserCurrentTrack.artistName}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
