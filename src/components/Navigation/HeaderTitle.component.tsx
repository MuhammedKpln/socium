import React from 'react'
import Image from 'react-native-ui-lib/image'

export const HeaderTitle = React.memo(function HeaderTitle() {
  return <Image assetName="logo" assetGroup="app" width={94} height={25} />
})
