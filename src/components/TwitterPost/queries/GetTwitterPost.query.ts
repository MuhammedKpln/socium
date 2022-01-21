import { ITwitterPost } from '@/types/socialMedia.types'
import { gql } from '@apollo/client'

export interface IFetchTwitterPostResponse {
  getTwitterPost: ITwitterPost
}

export interface IFetchTwitterPostVariables {
  twitterId: string
}

export const FETCH_TWITTER_POST = gql`
  query FETCH_TWITTER_POST($twitterId: String!) {
    getTwitterPost(twitterId: $twitterId) {
      data {
        text
      }
      includes {
        users {
          profile_image_url
          username
          name
        }

        media {
          type
          url
        }
      }
    }
  }
`
