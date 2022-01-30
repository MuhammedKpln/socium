import { Platform } from 'react-native'
import { Assets, Colors, ThemeManager, Typography } from 'react-native-ui-lib'

const colors = {
  primary: '#FE7949',
  surfaceDark: '#1C1C1C',
  surfaceLight: '#F8F8F8',
  textDark: '#fff',
  textLight: '#020D06',
  greyText: '#999999',
  yellow: '#FEB200',
  green: '#05DC20',
  red: '#DD0606',
}

const themes = {
  light: {
    textColor: colors.textLight,
    screenBG: '#fff',
    surfaceBG: colors.surfaceLight,
    navigationSurfaceBG: Colors.white,
    bottomTabIcon: '#A3BDCB',
    trueSurfaceBG: Colors.white,
  },
  dark: {
    textColor: colors.textDark,
    screenBG: '#000',
    surfaceBG: colors.surfaceDark,
    navigationSurfaceBG: Colors.black,
    bottomTabIcon: '#6B6B6B',
    trueSurfaceBG: Colors.black,
  },
}

// for more information - https://wix.github.io/react-native-ui-lib/foundation/style
export const configureDesignSystem = (): void => {
  Colors.loadColors(colors)
  Colors.loadSchemes(themes)
  Assets.loadAssetsGroup('app', {
    get NoData() {
      return require('../assets/images/NoData.webp')
    },
  })
  Assets.loadAssetsGroup('animations', {
    get typing() {
      return require('@/assets/animations/typing.json')
    },
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
    fontGilroy: {
      fontFamily: 'Gilroy-Semibold',
    },
    font22: {
      fontSize: 22,
    },
    font17: {
      fontSize: 17,
    },
    font12: {
      fontSize: 12,
    },
    font13: {
      fontSize: 13,
    },
    font15: {
      fontSize: 15,
    },
    font16: {
      fontSize: 16,
    },
    font28: {
      fontSize: 28,
    },
    fontSfProRegular: Platform.OS !== 'ios' && {
      fontFamily: 'SF-Pro-Display-Regular',
    },
    fontSfProMedium: Platform.OS !== 'ios' && {
      fontFamily: 'SF-Pro-Display-Medium',
    },
    fontSfProBold: Platform.OS !== 'ios' && {
      fontFamily: 'SF-Pro-Display-Bold',
    },
    fontSfProSemibold: Platform.OS !== 'ios' && {
      fontFamily: 'SF-Pro-Display-Semibold',
    },
    fontGilroyBold: {
      fontFamily: 'Gilroy-Bold',
    },
  })

  ThemeManager.setComponentTheme('Button', {
    'bg-primary': true,
    fontSfProMedium: true,
  })
}
