/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { enableFreeze, enableScreens } from 'react-native-screens'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

enableScreens(true)
enableFreeze(true)

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App))
