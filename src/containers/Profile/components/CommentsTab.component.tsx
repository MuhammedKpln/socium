import { Comment } from '@/components/Comment/Comment.component'
import {
  SkeletonView,
  SkeletonViewContentTypes,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
import {
  FETCH_USER_COMMENTS,
  IFetchUserCommentsResponse,
  IFetchUserCommentsVariables,
} from '@/graphql/queries/FetchComments.query'
import { IComment } from '@/Types/comment.types'
import { useQuery } from '@apollo/client'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { ICommentsTabProps } from '../Profile.props'

export function CommentsTab({ userId }: ICommentsTabProps) {
  const { data, loading } = useQuery<
    IFetchUserCommentsResponse,
    IFetchUserCommentsVariables
  >(FETCH_USER_COMMENTS, {
    variables: {
      userId,
    },
  })

  const renderItem = useCallback(({ item }: { item: IComment }) => {
    return (
      <Comment
        content={item.content}
        date={item.created_at}
        likeCount={item.postLike.likeCount}
        username={item.user.username}
      />
    )
  }, [])

  const renderData = useCallback(() => {
    return (
      <FlatList
        data={data?.getUserComments}
        renderItem={renderItem}
        style={{ height: '100%', width: '100%' }}
      />
    )
  }, [data, renderItem])

  return (
    <SkeletonView
      showContent={!loading}
      renderContent={renderData}
      template={SkeletonViewTemplates.LIST_ITEM}
      listProps={{
        contentType: SkeletonViewContentTypes.THUMBNAIL,
      }}
      times={data?.getUserComments.length}
    />
  )
}
