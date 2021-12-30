import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Surface } from '@/components/Surface/Surface.component'
import { useAppSelector } from '@/store'
import { incremented } from '@/store/reducers/counter.reducer'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { showToast, ToastStatus } from '@/utils/toast'
import React from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'

const HomeContainer = () => {
  const value = useAppSelector(state => state.counterSlice.value)
  const dispatch = useDispatch()

  return (
    <Page scrollable>
      <Icon name="Untitled" size={30} />
      <Surface padding-20 margin-10>
        <Button onPress={() => dispatch(incremented())}>
          <Text>selam {value}</Text>
        </Button>
      </Surface>
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
    </Page>
  )
}

export default HomeContainer
