import { Post } from '@/components/Post/Post.component'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { IPost } from '@/types/post.types'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { IPostsTabProps } from '../Profile.props'

export function PostsTab({ posts }: IPostsTabProps) {
  const renderItem = useCallback(({ item }: { item: IPost }) => {
    return (
      <Post
        title={item.title}
        commentsCount={item._count.comment}
        date={item.created_at}
        likesCount={item.postLike.likeCount}
        onPressPost={() => {
          navigate(Routes.PostDetails, { postId: item.id })
        }}
        postType={item.type}
        isLiked={item.userLike?.liked}
        key={item.slug}
        user={item.user}
        onPressRemove={() => null}
        content={item.content}
        onPressComment={() => null}
        onPressSave={() => null}
        onPressLike={() => null}
      />
    )
  }, [])

  return (
    <FlatList
      data={posts}
      style={{ height: '100%', width: '100%' }}
      renderItem={renderItem}
    />
  )
}
