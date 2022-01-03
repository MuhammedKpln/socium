import { Platform } from 'react-native'
import { Assets, Colors, ThemeManager, Typography } from 'react-native-ui-lib'

const colors = {
  primary: '#FE7949',
  surfaceDark: '#1C1C1C',
  surfaceLight: '#F8F8F8',
  textDark: '#fff',
  textLight: '#000',
  greyText: '#999999',
}

const themes = {
  light: {
    textColor: colors.textLight,
    screenBG: '#fff',
    surfaceBG: colors.surfaceLight,
  },
  dark: {
    textColor: colors.textDark,
    screenBG: '#000',
    surfaceBG: colors.surfaceDark,
  },
}

// for more information - https://wix.github.io/react-native-ui-lib/foundation/style
export const configureDesignSystem = (): void => {
  Colors.loadColors(colors)
  Colors.loadSchemes(themes)
  Assets.loadAssetsGroup('app', {
    logo: require('@/assets/images/logo.png'),
  })

  Typography.loadTypographies({
    section: { fontSize: 26, fontWeight: '600' },
    header: Platform.select({
      android: {
        fontSize: 22,
        fontWeight: '700',
        fontFamily: 'SourceSansPro-Bold',
      },
      ios: {
        fontSize: 22,
        fontWeight: '700',
      },
    }),
    title: Platform.select({
      android: {
        fontSize: 17,
        fontWeight: '700',
        fontFamily: 'SourceSansPro-Bold',
      },
      ios: {
        fontSize: 22,
        fontWeight: '700',
      },
    }),
  })

  ThemeManager.setComponentTheme('Button', {
    height: 55,
  })
}
