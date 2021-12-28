import { gql } from '@apollo/client'

export const VERIFIY_EMAIL = gql`
  mutation VERIFY_EMAIL($verificationCode: Float!, $email: String!) {
    confirmEmail(data: { email: $email, verificationCode: $verificationCode })
  }
`

export const RESEND_CONFIRM_MAIL = gql`
  mutation RESEND_CONFIRM_MAIL {
    resendConfirmMail
  }
`
