import { Comment } from '@/components/Comment/Comment.component'
import { NotFound } from '@/components/NotFound/NotFound.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  ILikeCommentResponse,
  ILikeCommentVariables,
  IUnlikeCommentResponse,
  IUnlikeCommentVariables,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
} from '@/graphql/mutations/LikePost.mutation'
import {
  FETCH_COMMENTS,
  IFetchCommentsResponse,
  IFetchCommentsVariables,
} from '@/graphql/queries/FetchComments.query'
import { useAppSelector } from '@/store'
import {
  updateAnsweringParent,
  updateComments,
} from '@/store/reducers/comment.reducer'
import type { IComment } from '@/Types/comment.types'
import { useMutation, useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { useDispatch } from 'react-redux'

export interface IPostCommentsProps {
  postId: number
}

export function PostComments(props: IPostCommentsProps) {
  const { postId } = props
  const dispatch = useDispatch()
  const comments = useAppSelector(state => state.commentReducer.comments)
  const [likeComment] = useMutation<
    ILikeCommentResponse,
    ILikeCommentVariables
  >(LIKE_COMMENT)
  const [unlikeComment] = useMutation<
    IUnlikeCommentResponse,
    IUnlikeCommentVariables
  >(UNLIKE_COMMENT)
  const { loading, fetchMore } = useQuery<
    IFetchCommentsResponse,
    IFetchCommentsVariables
  >(FETCH_COMMENTS, {
    variables: {
      postId,
      limit: 15,
      offset: 0,
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      console.log('DADA', data)
      dispatch(updateComments(data.getPostComments))
    },
  })

  const onPressAnswer = useCallback(
    (commentId: number) => {
      dispatch(updateAnsweringParent(commentId))
    },
    [dispatch],
  )

  const onPressLikeComment = useCallback(
    (commentId: number) => {
      likeComment({
        variables: {
          commentId,
        },
        update: (cache, { data }) => {
          const oldData = comments

          oldData.map(comment => {
            if (comment.id === commentId) {
              comment.postLike.likeCount = data?.likeEntry.likeCount ?? 0
              comment.userLike = data?.likeEntry.userLike ?? null
            } else {
              const isParent = comment.parentComments.filter(
                v => v.id === commentId,
              )

              if (isParent.length > 0) {
                isParent[0].postLike.likeCount = data?.likeEntry.likeCount ?? 0
                isParent[0].userLike = data?.likeEntry.userLike ?? null
              }
            }

            return comment
          })

          dispatch(updateComments([...oldData]))
        },
      })
    },
    [likeComment, dispatch, comments],
  )
  const onPressUnlikeComment = useCallback(
    (commentId: number) => {
      unlikeComment({
        variables: {
          commentId,
        },
        update: (cache, { data }) => {
          const oldData = comments

          oldData.map(comment => {
            if (comment.id === commentId) {
              comment.postLike.likeCount = data?.unlikeEntry.likeCount ?? 0
              comment.userLike = {
                ...comment.userLike,
                liked: data?.unlikeEntry ? false : true,
              }
            } else {
              const isParent = comment.parentComments.filter(
                v => v.id === commentId,
              )

              if (isParent.length > 0) {
                isParent[0].postLike.likeCount =
                  data?.unlikeEntry.likeCount ?? 0
                isParent[0].userLike = data?.unlikeEntry.userLike ?? null
              }
            }

            return comment
          })

          dispatch(updateComments([...oldData]))
        },
      })
    },
    [dispatch, comments, unlikeComment],
  )

  const renderItem = useCallback(
    ({ item }: { item: IComment }) => {
      return (
        <Comment
          key={item.id}
          parentComments={item.parentComments}
          content={item.content}
          date={item.created_at}
          likeCount={item.postLike.likeCount}
          username={item.user.username}
          avatar={item.user.avatar}
          onPressAnswer={() => onPressAnswer(item.id)}
          onPressLike={(commentId?: number) =>
            onPressLikeComment(commentId || item.id)
          }
          onPressUnlike={(commentId?: number) =>
            onPressUnlikeComment(commentId || item.id)
          }
          isLiked={item?.userLike?.liked ?? false}
          showLikeButton
        />
      )
    },
    [onPressAnswer, onPressLikeComment, onPressUnlikeComment],
  )

  const fetchMorePosts = useCallback(async () => {
    if (comments.length <= 15) {
      return
    }

    const offset = comments.length
    await fetchMore({
      variables: {
        limit: 10,
        offset,
        postId,
      },
    }).then(response => {
      dispatch(updateComments([...comments, ...response.data.getPostComments]))
    })
  }, [comments, postId, fetchMore, dispatch])

  const renderContent = useCallback(() => {
    return (
      <FlatList
        data={comments}
        renderItem={renderItem}
        onEndReached={fetchMorePosts}
        nestedScrollEnabled
        ListEmptyComponent={
          <NotFound
            size={100}
            title="Bu gönderiye yapılmış herhangi bir yorum bulunamadı!"
            subtitle="Yorumlarınızı yazabilir, yorumlarınızı beğenip beğenmeyeceğinizi tahmin edebilirsiniz!"
          />
        }
      />
    )
  }, [comments, renderItem, fetchMorePosts])

  return (
    <SkeletonView
      renderContent={renderContent}
      showContent={loading ? false : true}
      template={SkeletonViewTemplates.LIST_ITEM}
      times={comments.length}
    />
  )
}
