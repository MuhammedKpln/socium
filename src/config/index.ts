const dev = true

export const Config = {
  STATIC_URL: dev
    ? 'https://derdevam.com/static'
    : 'https://derdevam.com/static',
  GRAPHQL_WS_URL: dev
    ? 'ws://81.226.94.21:3000/graphql'
    : 'wss://derdevam.com/graphql',
  API_URL: dev ? 'http://81.226.94.21:3000' : 'https://derdevam.com',
  SOCKET_URL: dev ? 'ws://81.226.94.21:3001' : 'wss://cio.derdevam.com',
  APP_TITLE: 'Socium',
  APP_SLOGAN: 'Socium ile içinizi dökmeye hazır mısınız?',
  APP_PLAYSTORE_LINK: 'https://derdevam.com',
  SPOTIFY_CLIENT_ID: 'b0c62d8c63bd4dda80b2020fa26f97b5',
  NEW_COMMENT_MAX_COUNT: 200,
  NEW_COMMENT_MIN_COUNT: 10,
  ADMOB_UNIT_ID: 'ca-app-pub-5089133101627366/5098947737',
}

export const EnabledFeatures = {
  appleLogin: false,
}

// export const Config = {
//   STATIC_URL: dev
//     ? 'https://derdevam.com/static'
//     : 'https://derdevam.com/static',
//   GRAPHQL_WS_URL: dev
//     ? 'wss://derdevam.com/graphql'
//     : 'wss://derdevam.com/graphql',
//   API_URL: dev ? 'https://derdevam.com' : 'https://derdevam.com',
//   SOCKET_URL: dev
//     ? 'https://cio.derdevam.com/PairingScreen'
//     : 'https://cio.derdevam.com/PairingScreen',
//   APP_TITLE: 'Derdevam',
//   APP_PLAYSTORE_LINK: 'https://derdevam.com',
// }
