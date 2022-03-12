import LogoGrey from '@/assets/icons/LogoGrey'
import SettingsBell from '@/assets/icons/SettingsBell'
import SettingsKullanim from '@/assets/icons/SettingsKullanim'
import SettingsLogout from '@/assets/icons/SettingsLogout'
import SettingsMoon from '@/assets/icons/SettingsMoon'
import SettingsPrivacy from '@/assets/icons/SettingsPrivacy'
import { Icon } from '@/components/Icon/Icon.component'
import { Page } from '@/components/Page/Page.component'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { useAppSelector } from '@/store'
import { toggleNotifications } from '@/store/reducers/app.reducer'
import { clear } from '@/store/reducers/spotify.reducer'
import { updateTheme } from '@/store/reducers/theme.reducer'
import { logout } from '@/store/reducers/user.reducer'
import { map } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import ListItem from 'react-native-ui-lib/listItem'
import Switch from 'react-native-ui-lib/switch'
import Text from 'react-native-ui-lib/text'
import View from 'react-native-ui-lib/view'
import { useDispatch } from 'react-redux'

export interface IMenu {
  title: string
  icon: React.ReactElement
  onPress?: () => void
  right?: React.ReactElement
  if?: boolean
  else?: Exclude<IMenu, 'if' & 'else'>
}

//TODO: imports
export function SettingsContainer() {
  const dispatch = useDispatch()
  const darkMode = useAppSelector(state =>
    state.themeReducer.theme === 'dark' ? true : false,
  )
  const isLoggedIn = useAppSelector(state => state.userReducer.isLoggedIn)
  const notifications = useAppSelector(state => state.appReducer.notifications)

  const _toggleNotifications = useCallback(() => {
    dispatch(toggleNotifications())
  }, [dispatch])

  const changeTheme = useCallback(() => {
    dispatch(updateTheme({ theme: darkMode ? 'light' : 'dark' }))
  }, [darkMode, dispatch])

  const onPressLogout = useCallback(() => {
    dispatch(logout())
    dispatch(clear())

    navigate(Routes.Home, {})
  }, [dispatch])
  const onPressLogin = useCallback(() => {
    navigate(Routes.Login, {})
  }, [])

  const menu = useMemo(() => {
    return [
      {
        icon: <SettingsMoon />,
        title: 'Karanlık mod',
        right: <Switch value={darkMode} onValueChange={changeTheme} />,
      },
      {
        icon: <SettingsBell />,
        title: 'Uygulama Bildirimleri',
        right: (
          <Switch value={notifications} onValueChange={_toggleNotifications} />
        ),
      },
      {
        icon: <SettingsPrivacy />,
        title: 'Gizlilik Politikası',
        right: <Icon name="right" size={20} />,
      },
      {
        icon: <SettingsKullanim />,
        title: 'Kullanım Şartları',
        right: <Icon name="right" size={20} />,
      },
      {
        icon: <SettingsLogout />,
        title: 'Çıkış Yap',
        right: <Icon name="right" size={20} />,
        onPress: onPressLogout,
        if: !isLoggedIn,
        else: {
          icon: <SettingsLogout />,
          title: 'Giris Yap',
          right: <Icon name="right" size={20} />,
          onPress: onPressLogin,
        },
      },
    ]
  }, [
    darkMode,
    changeTheme,
    notifications,
    _toggleNotifications,
    onPressLogout,
    isLoggedIn,
    onPressLogin,
  ])

  return (
    <Page>
      <View>
        {map(menu, m => (
          <ListItem
            style={{ marginBottom: 20 }}
            onPress={m?.if ? m.else.onPress : m.onPress}
          >
            <ListItem.Part left>{m.icon}</ListItem.Part>
            <ListItem.Part middle marginL-15>
              <Text document textColor>
                {m?.if ? m.else.title : m.title}
              </Text>
            </ListItem.Part>
            <ListItem.Part right>
              {m?.if ? m.else.right : m.right}
            </ListItem.Part>
          </ListItem>
        ))}
      </View>
      <View
        width={100}
        height={30}
        center
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 50,
        }}
      >
        <LogoGrey />
      </View>
    </Page>
  )
}
