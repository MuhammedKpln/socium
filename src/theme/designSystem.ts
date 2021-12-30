import { Colors, Typography } from 'react-native-ui-lib'

const colors = {
  primary: '#5383b8', // blue
  secondary: '#469c57', // green
  accent: '#fed330', // yellow
  blackish: Colors.rgba(20, 20, 20, 1),
  blackish2: Colors.rgba(50, 50, 50, 1),
  whitish: Colors.rgba(250, 250, 250, 1),
  whitish2: Colors.rgba(230, 230, 230, 1),
  info: '#5383b8',
  error: Colors.red40,
  success: Colors.green40,
}

const themes = {
  light: {
    textColor: colors.blackish,
    screenBG: colors.whitish,
    surfaceBG: colors.whitish2,
    bg2Color: colors.whitish2,
  },
  dark: {
    textColor: colors.whitish,
    screenBG: colors.blackish,
    surfaceBG: colors.blackish2,
    bg2Color: colors.blackish2,
  },
}

// for more information - https://wix.github.io/react-native-ui-lib/foundation/style
export const configureDesignSystem = (): void => {
  Colors.loadColors(colors)
  Colors.loadSchemes(themes)

  Typography.loadTypographies({
    section: { fontSize: 26, fontWeight: '600' },
  })
}
