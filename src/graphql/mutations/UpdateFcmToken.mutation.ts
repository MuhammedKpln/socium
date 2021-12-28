import { gql } from '@apollo/client'

export const UPDATE_FCM_TOKEN = gql`
  mutation UPDATE_FCM_TOKEN($fcmToken: String!) {
    saveUserFcmToken(fcmToken: $fcmToken)
  }
`
