import { useAppSelector } from '@/store'
import { incremented } from '@/store/reducers/counter.reducer'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { showToast, ToastStatus } from '@/utils/toast'
import React from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'

const HomeContainer = () => {
  const value = useAppSelector(state => state.counterSlice.value)
  const dispatch = useDispatch()

  return (
    <View flex bg-screenBG>
      <Text>selam {value}</Text>

      <Button onPress={() => dispatch(incremented())}>
        <Text>selam</Text>
      </Button>
      <Button onPress={() => showToast(ToastStatus.Success, 'selam')}>
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
