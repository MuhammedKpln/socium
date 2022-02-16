import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { matchEmitter } from '@/services/events.service'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { MatchingFoundComponent } from '../components/MatchingFound.component'

export function MatchingFoundContainer() {
  const routes =
    useRoute<RouteProp<INavigatorParamsList, Routes.MatchingFound>>()
  const navigation = useNavigation()

  useEffect(() => {
    matchEmitter.addListener('acceptMatch', () => {
      navigateBack()
      navigation.navigate(Routes.MatchChat, {
        room: routes.params.room,
        user: routes.params.user,
        uuid: routes.params.uuid,
      })
    })
    matchEmitter.addListener('rejectMatch', () => {
      navigateBack()
    })

    return () => {
      matchEmitter.removeAllListeners()
    }
  }, [routes, navigation])

  return <MatchingFoundComponent {...routes.params} />
}
