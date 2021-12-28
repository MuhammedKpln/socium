import { useAppSelector } from '@/store'
import React from 'react'
import { Text } from 'react-native'
import { Button } from 'react-native-ui-lib'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'
import { incremented } from '@/store/reducers/counter.reducer'

const HomeContainer = () => {
  const value = useAppSelector(state => state.counterSlice.value)
  const dispatch = useDispatch()

  return (
    <View>
      <Text>selam {value}</Text>

      <Button onPress={() => dispatch(incremented())}>
        <Text>selam</Text>
      </Button>
    </View>
  )
}

export default HomeContainer
