export const Config = {
  STATIC_URL: __DEV__
    ? 'https://derdevam.com/static'
    : 'https://derdevam.com/static',
  GRAPHQL_WS_URL: __DEV__
    ? 'ws://LOCALHOST:3000/graphql'
    : 'wss://derdevam.com/graphql',
  API_URL: __DEV__ ? 'http://LOCALHOST:3000' : 'https://derdevam.com',
  SOCKET_URL: __DEV__
    ? 'http://LOCALHOST:3001/PairingScreen'
    : 'https://cio.derdevam.com/PairingScreen',
  APP_TITLE: 'Derdevam',
  APP_SLOGAN: 'Derdevam ile içinizi dökmeye hazır mısınız?',
  APP_PLAYSTORE_LINK: 'https://derdevam.com',
  SPOTIFY_CLIENT_ID: 'b0c62d8c63bd4dda80b2020fa26f97b5',
  NEW_COMMENT_MAX_COUNT: 200,
  NEW_COMMENT_MIN_COUNT: 10,
}

// export const Config = {
//   STATIC_URL: __DEV__
//     ? 'https://derdevam.com/static'
//     : 'https://derdevam.com/static',
//   GRAPHQL_WS_URL: __DEV__
//     ? 'wss://derdevam.com/graphql'
//     : 'wss://derdevam.com/graphql',
//   API_URL: __DEV__ ? 'https://derdevam.com' : 'https://derdevam.com',
//   SOCKET_URL: __DEV__
//     ? 'https://cio.derdevam.com/PairingScreen'
//     : 'https://cio.derdevam.com/PairingScreen',
//   APP_TITLE: 'Derdevam',
//   APP_PLAYSTORE_LINK: 'https://derdevam.com',
// }