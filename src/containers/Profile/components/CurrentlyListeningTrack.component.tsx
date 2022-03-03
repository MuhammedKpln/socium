import { Icon } from '@/components/Icon/Icon.component'
import { SkeletonView } from '@/components/SkeletonView/SkeletonView.component'
import {
  GET_USER_CURRENT_TRACK,
  IFetchUserCurrentTrackResponse,
  IFetchUserCurrentTrackVariables,
} from '@/graphql/queries/GetUserCurrentTrack.query'
import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'

interface IProps {
  userId: number | undefined
}

export default function CurrentlyListeningTrack(props: IProps) {
  const { userId } = props
  const [fetchUserTrack, currentTrack] = useLazyQuery<
    IFetchUserCurrentTrackResponse,
    IFetchUserCurrentTrackVariables
  >(GET_USER_CURRENT_TRACK)

  useEffect(() => {
    if (!userId) return

    fetchUserTrack({ variables: { userId } })
  }, [userId, fetchUserTrack])

  if (!userId && currentTrack.loading)
    return <SkeletonView height={30} width={200} />

  return (
    <View bg-green padding-10 row left br100>
      <Icon name="spotify" color="#FFF" size={20} />
      <Text white center marginL-10 font15 fontSfProRegular>
        🎶 {currentTrack.data?.getUserCurrentTrack.songName}
      </Text>
    </View>
  )
}
