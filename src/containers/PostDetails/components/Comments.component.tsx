import { Comment } from '@/components/Comment/Comment.component'
import { NotFound } from '@/components/NotFound/NotFound.component'
import {
  SkeletonView,
  SkeletonViewTemplates,
} from '@/components/SkeletonView/SkeletonView.component'
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
import { IComment } from '@/Types/comment.types'
import { useQuery } from '@apollo/client'
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

  const renderItem = useCallback(
    ({ item }: { item: IComment }) => {
      return (
        <Comment
          parentComments={item.parentComments}
          content={item.content}
          date={item.created_at}
          likeCount={item.postLike.likeCount}
          username={item.user.username}
          avatar={item.user.avatar}
          onPressAnswer={() => onPressAnswer(item.id)}
        />
      )
    },
    [onPressAnswer],
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
