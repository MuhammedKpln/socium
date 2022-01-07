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
import { updateTheme } from '@/store/reducers/theme.reducer'
import { logout } from '@/store/reducers/user.reducer'
import { map } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { ListItem, Switch, Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'

export interface IMenu {
  title: string
  icon: React.ReactElement
  onPress?: () => void
  right?: React.ReactElement
}

export function SettingsContainer() {
  const dispatch = useDispatch()
  const darkMode = useAppSelector(state =>
    state.themeReducer.theme === 'dark' ? true : false,
  )

  const toggleNotifications = useCallback(() => {}, [])

  const changeTheme = useCallback(() => {
    dispatch(updateTheme({ theme: darkMode ? 'light' : 'dark' }))
  }, [darkMode, dispatch])

  const onPressLogout = useCallback(() => {
    dispatch(logout())

    navigate(Routes.App, {})
  }, [dispatch])

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
        right: <Switch value={darkMode} onValueChange={toggleNotifications} />,
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
        right: <Icon name="right" size={20} onPress={onPressLogout} />,
      },
    ]
  }, [changeTheme, darkMode, toggleNotifications, onPressLogout])

  return (
    <Page>
      <View>
        {map(menu, m => (
          <ListItem style={{ marginBottom: 20 }}>
            <ListItem.Part left>{m.icon}</ListItem.Part>
            <ListItem.Part middle marginL-15>
              <Text document textColor>
                {m.title}
              </Text>
            </ListItem.Part>
            <ListItem.Part right>{m.right}</ListItem.Part>
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
