import {
  ILikeCommentResponse,
  ILikeCommentVariables,
  IUnlikeCommentResponse,
  IUnlikeCommentVariables,
  LIKE_COMMENT,
  LIKE_POST,
  UNLIKE_POST,
} from '@/graphql/mutations/LikePost.mutation'
import { ERROR_CODES, ERROR_CODES_RAW } from '@/types/error_codes'
import { IUserlike } from '@/Types/post.types'
import { handleApolloErrors } from '@/utils/apollo'
import { showToast, ToastStatus } from '@/utils/toast'
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

export enum IUseLikesEntity {
  POST = 'post',
  COMMENT = 'comment',
}

export interface IUseLikesProps {
  entityType: IUseLikesEntity
  isLiked: boolean
  entityId: number
}

export interface ILikedEntityResponse {
  entityType: IUseLikesEntity
  isLiked: boolean
}
export interface ILikedEntityResponse {
  entityType: IUseLikesEntity
  isLiked: boolean
}

export function useLikes() {
  const [likePost] = useMutation<{ likeEntry: IUserlike }, { postId: number }>(
    LIKE_POST,
    {
      onCompleted: () => {
        showToast(ToastStatus.Success, 'Beğendiniz!')
      },
      onError: err => {
        const errorCode = handleApolloErrors(err, ERROR_CODES_RAW.ALREADY_LIKED)

        if (errorCode) {
          showToast(ToastStatus.Error, ERROR_CODES[errorCode])
        }
      },
    },
  )

  const [unlikePost] = useMutation<
    { likeEntry: IUserlike },
    { postId: number }
  >(UNLIKE_POST, {
    onCompleted: () => {
      showToast(ToastStatus.Success, 'Beğendiniyi geri çektiniz!')
    },
  })

  const [likeComment] = useMutation<
    ILikeCommentResponse,
    ILikeCommentVariables
  >(LIKE_COMMENT, {
    onCompleted: () => {
      showToast(ToastStatus.Success, 'Beğendiniz!')
    },
    onError: err => {
      const errorCode = handleApolloErrors(err, ERROR_CODES_RAW.ALREADY_LIKED)

      if (errorCode) {
        showToast(ToastStatus.Error, ERROR_CODES[errorCode])
      }
    },
  })
  const [unlikeComment] = useMutation<
    IUnlikeCommentResponse,
    IUnlikeCommentVariables
  >(LIKE_COMMENT, {
    onCompleted: () => {
      showToast(ToastStatus.Success, 'Beğendiniz!')
    },
    onError: err => {
      const errorCode = handleApolloErrors(err, ERROR_CODES_RAW.ALREADY_LIKED)

      if (errorCode) {
        showToast(ToastStatus.Error, ERROR_CODES[errorCode])
      }
    },
  })

  const toggleLikeButton = useCallback(
    async (props: IUseLikesProps): Promise<ILikedEntityResponse> => {
      const { isLiked, entityId, entityType } = props

      if (entityType === IUseLikesEntity.POST) {
        if (isLiked) {
          await unlikePost({
            variables: {
              postId: entityId,
            },
          })

          return Promise.resolve({
            entityType,
            isLiked: false,
          })
        }

        await likePost({
          variables: {
            postId: entityId,
          },
        })

        return Promise.resolve({
          entityType,
          isLiked: true,
        })
      }

      if (entityType === IUseLikesEntity.COMMENT) {
        if (isLiked) {
          await unlikeComment({
            variables: {
              commentId: entityId,
            },
          })

          return Promise.resolve({
            entityType,
            isLiked: false,
          })
        }

        await likeComment({
          variables: {
            commentId: entityId,
          },
        })

        return Promise.resolve({
          entityType,
          isLiked: true,
        })
      }

      return Promise.reject()
    },
    [likePost, unlikePost, likeComment, unlikeComment],
  )

  return {
    toggleLikeButton,
  }
}
