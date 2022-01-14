import { Page } from '@/components/Page/Page.component'
import { wait } from '@/utils/utils'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import { MatchComponent } from './components/Match.component'
import { MatchingFoundComponent } from './components/MatchingFound.component'

export function MatchContainer() {
  const [matching, setMatching] = useState<boolean>(false)
  const [matched, setMatched] = useState<boolean>(false)

  useEffect(() => {
    if (matching) {
      wait(2000).then(() => {
        setMatched(true)
      })
    }
  }, [matching])

  return (
    <Page center>
      {!matching ? (
        <MatchComponent onPressMatch={() => setMatching(!matching)} />
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
    </Page>
  )
}
