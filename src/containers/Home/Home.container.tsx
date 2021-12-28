import { useAppSelector } from '@/store'
import React from 'react'
import { Text } from 'react-native'
import { Button, Colors } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import { incremented } from '@/store/reducers/counter.reducer'
import { SCHEME_TYPES } from '@/theme/designSystem'
import { updateTheme } from '@/store/reducers/theme.reducer'

const HomeContainer = () => {
  const value = useAppSelector(state => state.counterSlice.value)
  const dispatch = useDispatch()

  return (
    <View flex bg-screenBG>
      <Text>selam {value}</Text>

      <Button onPress={() => dispatch(incremented())}>
        <Text>selam</Text>
      </Button>
      <Button
        onPress={() =>
          dispatch(
            updateTheme({
              theme: 'dark',
            }),
          )
        }
      >
        <Text>dark mode</Text>
      </Button>
      <Button
        onPress={() =>
          dispatch(
            updateTheme({
              theme: 'light',
            }),
          )
        }
      >
        <Text>light mode</Text>
      </Button>
    </View>
  )
}

export default HomeContainer
