import { Comment } from '@/components/Comment/Comment.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  FETCH_COMMENTS,
  IFetchCommentsResponse,
  IFetchCommentsVariables,
} from '@/graphql/queries/FetchComments.query'
import { IComment } from '@/Types/comment.types'
import { useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'

export interface IPostCommentsProps {
  postId: number
}

export function PostComments(props: IPostCommentsProps) {
  const { postId } = props

  const comments = useQuery<IFetchCommentsResponse, IFetchCommentsVariables>(
    FETCH_COMMENTS,
    {
      variables: {
        postId,
      },
    },
  )

  const renderItem = useCallback(({ item }: { item: IComment }) => {
    console.log
    return (
      <Comment
        parentComments={item?.parentUser?.userParentComments}
        content={item.content}
        date={item.created_at}
        likeCount={item.postLike.likeCount}
        username={item.user.username}
      />
    )
  }, [])

  const renderContent = useCallback(() => {
    return (
      <FlatList data={comments.data?.getPostComments} renderItem={renderItem} />
    )
  }, [comments.data?.getPostComments, renderItem])

  return (
    <SkeletonView
      renderContent={renderContent}
      showContent={comments.loading ? false : true}
      template={SkeletonViewTemplates.LIST_ITEM}
      times={comments.data?.getPostComments?.length}
    />
  )
}
