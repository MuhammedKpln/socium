import { Comment } from '@/components/Comment/Comment.component'
import { NotFound } from '@/components/NotFound/NotFound.component'
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
import { FlatList, View } from 'react-native'
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
      <View style={{ flex: 1 }}>
        <FlatList
          data={data?.getUserComments}
          ListEmptyComponent={
            <NotFound
              size={100}
              title="Kullanıcının herhangi bir yorumu bulunmamakta."
              subtitle="Yorumlarınızı yazabilir, yorumlarınızı beğenip beğenmeyeceğinizi tahmin edebilirsiniz!"
            />
          }
          renderItem={renderItem}
          style={{ height: '100%', width: '100%', flex: 1 }}
        />
      </View>
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
