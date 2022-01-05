import { useAppSelector } from '@/store'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from 'react-native-ui-lib'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 10,
    margin: 10,
    borderRadius: 30,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginTop: -30,
    backgroundColor: '#fff',
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
})

export default function ({ state, descriptors, navigation }) {
  const { bottom } = useSafeAreaInsets()
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)

  return (
    <View style={[styles.container, { bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]

        const icon = options.tabBarIcon

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true })
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <View style={styles.buttonContainer}>
            {route.name === Routes.Pairing ? (
              <IconButton
                icon={() => <ChatTabbar width={50} height={50} />}
                style={[styles.button]}
                onPress={() =>
                  user.isLoggedIn ? onPress() : navigate(Routes.Login, {})
                }
                onLongPress={() =>
                  user.isLoggedIn ? onLongPress() : navigate(Routes.Login, {})
                }
                color="#fff"
                size={isFocused ? 30 : 24}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
              />
            ) : (
              <>
                {(!user.isLoggedIn && route.name === Routes.MyProfile) ||
                (!user.isLoggedIn && route.name === Routes.Notifications) ||
                (!user.isLoggedIn && route.name === Routes.Discover) ? (
                  <IconButton
                    icon={icon}
                    onPress={() => navigate(Routes.Login, {})}
                    size={isFocused ? 30 : 24}
                    color="#fff"
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                  />
                ) : (
                  <IconButton
                    icon={icon}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    size={isFocused ? 30 : 24}
                    color="#fff"
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                  />
                )}
              </>
            )}
          </View>
        )
      })}
    </View>
  )
}
