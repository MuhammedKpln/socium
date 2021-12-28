import {gql} from '@apollo/client';

export const UserFragment = gql`
  fragment UserFields on User {
    username
    id
    email
    gender
    avatar
    bio
    isEmailConfirmed
    birthday
    blockIncomingCalls
    userAvatarMeta {
      avatar
    }
  }
`;
