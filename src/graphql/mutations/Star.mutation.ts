import { gql } from '@apollo/client'

export const ADD_NEW_STAR = gql`
  mutation ADD_NEW_STAR {
    addNewStar {
      starCount
    }
  }
`
