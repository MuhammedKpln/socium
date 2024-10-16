/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { enableFreeze, enableScreens } from 'react-native-screens'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { configureDesignSystem } from '@/theme/designSystem'

configureDesignSystem()
enableScreens(true)
enableFreeze(false)

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App))
