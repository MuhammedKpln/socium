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
    navigationSurfaceBG: Colors.white,
    bottomTabIcon: '#A3BDCB',
  },
  dark: {
    textColor: colors.textDark,
    screenBG: '#000',
    surfaceBG: colors.surfaceDark,
    navigationSurfaceBG: Colors.black,
    bottomTabIcon: '#6B6B6B',
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
        fontSize: 17,
        fontWeight: '700',
      },
    }),
    text: {
      fontSize: 14,
    },
    document: {
      fontSize: 15,
    },
    bold: {
      fontWeight: 'bold',
    },
  })

  //@ts-ignore
  ThemeManager.setComponentTheme('Text', props => {
    if (!props.color || !props.textColor) {
      return {
        color: Colors.textcolor,
      }
    }
  })
  ThemeManager.setComponentTheme('Button', {
    'bg-primary': true,
  })
}
