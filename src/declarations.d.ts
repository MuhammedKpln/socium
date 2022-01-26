import { INavigatorParamsList } from './navigators/navigator.props'

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg'
  import React from 'react'

  const content: React.FC<SvgProps>
  export default content
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends INavigatorParamsList {}
  }
}
