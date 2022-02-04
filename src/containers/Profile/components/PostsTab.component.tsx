import { NotFound } from '@/components/NotFound/NotFound.component'
import { Post } from '@/components/Post/Post.component'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { IPost } from '@/types/post.types'
import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { View } from 'react-native-ui-lib'
import { IPostsTabProps } from '../Profile.props'

export function PostsTab({ posts }: IPostsTabProps) {
  const renderItem = useCallback(({ item }: { item: IPost }) => {
    return (
      <Post
        additional={item.additional}
        commentsCount={item._count.comment}
        date={item.created_at}
        likesCount={item.postLike.likeCount}
        onPressPost={() => {
          navigate(Routes.PostDetails, { postId: item.id })
        }}
        postType={item.type}
        isLiked={item.userLike?.liked ?? false}
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
    <View flex>
      <FlatList
        data={posts}
        style={{ height: '100%', width: '100%' }}
        ListEmptyComponent={
          <NotFound
            size={100}
            title="Kullanıcının herhangi bir gönderisi bulunmamakta."
            subtitle="Gönderilerinizi yazabilir, yorumlarınızın beğenip beğenmeyeceğinizi tahmin edebilirsiniz!"
          />
        }
        renderItem={renderItem}
      />
    </View>
  )
}
