import gql from 'graphql-tag'

export const FETCH_COMMENTS = gql`
  query FETCH_POST_COMMENTS(
    $postId: Float!
    $offset: Float = 0
    $limit: Float = 10
  ) {
    getPostComments(
      postId: $postId
      pagination: { offset: $offset, limit: $limit }
    ) {
      id
      content
      user {
        id
        bio
        username
      }
      userLike {
        liked
      }
      postLike {
        likeCount
      }
    }
  }
`
