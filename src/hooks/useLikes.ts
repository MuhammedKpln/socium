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
import { IPostLike, IUserlike } from '@/Types/post.types'
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
  result: IPostLike
}

export function useLikes() {
  const [likePost] = useMutation<{ likeEntry: IPostLike }, { postId: number }>(
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
    { unlikeEntry: IPostLike },
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
          const { data } = await unlikePost({
            variables: {
              postId: entityId,
            },
          })

          if (data?.unlikeEntry) {
            return Promise.resolve({
              entityType,
              isLiked: false,
              result: data?.unlikeEntry,
            })
          }
        }

        const { data } = await likePost({
          variables: {
            postId: entityId,
          },
        })

        if (data?.likeEntry) {
          return Promise.resolve({
            entityType,
            isLiked: true,
            result: data.likeEntry,
          })
        }
      }

      if (entityType === IUseLikesEntity.COMMENT) {
        if (isLiked) {
          const { data } = await unlikeComment({
            variables: {
              commentId: entityId,
            },
          })

          if (data?.unlikeEntry) {
            return Promise.resolve({
              entityType,
              isLiked: false,
              result: data.unlikeEntry,
            })
          }
        }

        const { data } = await likeComment({
          variables: {
            commentId: entityId,
          },
        })
        if (data?.likeEntry) {
          return Promise.resolve({
            entityType,
            isLiked: true,
            result: data.likeEntry,
          })
        }
      }

      return Promise.reject()
    },
    [likePost, unlikePost, likeComment, unlikeComment],
  )

  return {
    toggleLikeButton,
  }
}
