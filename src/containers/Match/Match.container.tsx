import { Page } from '@/components/Page/Page.component'
import { wait } from '@/utils/utils'
import React, { useCallback, useEffect, useState } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { MatchComponent } from './components/Match.component'
import { MatchingFoundComponent } from './components/MatchingFound.component'

export function MatchContainer() {
  const [matching, setMatching] = useState<boolean>(false)
  const [matched, setMatched] = useState<boolean>(false)
  const marginBottom = useSharedValue(0)
  const opacity = useSharedValue(1)

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(marginBottom.value, {
        duration: 400,
      }),
    }
  })
  const matchComponentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 600,
      }),
    }
  })

  const onPressMatch = useCallback(() => {
    marginBottom.value = 300
    opacity.value = 0

    wait(700).then(() => {
      setMatching(true)
    })
  }, [marginBottom, opacity])

  useEffect(() => {
    if (matching) {
      wait(2000).then(() => {
        setMatched(true)
        marginBottom.value = 0

        opacity.value = 1
      })
    }
  }, [matching, marginBottom, opacity])

  return (
    <Page animated center>
      <Animated.View style={containerAnimatedStyle}>
        {!matching ? (
          <Animated.View style={matchComponentStyle}>
            <MatchComponent onPressMatch={() => onPressMatch()} />
          </Animated.View>
        ) : (
          <View>
            <Text fontGilroy marginT-250 style={{ fontSize: 22 }}>
              Eşleşme bekleniyor...
            </Text>
            {matched ? (
              <MatchingFoundComponent
                onPressClose={() => {
                  setMatching(false)
                  setMatched(false)
                }}
              />
            ) : null}
          </View>
        )}
      </Animated.View>
    </Page>
  )
}
