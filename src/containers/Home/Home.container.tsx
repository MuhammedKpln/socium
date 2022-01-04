import { Page } from '@/components/Page/Page.component'
import { Post } from '@/components/Post/Post.component'
import { FETCH_POSTS } from '@/graphql/queries/FetchPosts.query'
import { Routes } from '@/navigators/navigator.props'
import { navigate } from '@/navigators/utils/navigation'
import { IPost } from '@/Types/post.types'
import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import SkeletonView from 'react-native-ui-lib/skeletonView'
import Text from 'react-native-ui-lib/text'

const HomeContainer = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const fetchPosts = useQuery<{ posts: IPost[] }>(FETCH_POSTS, {
    onCompleted: data => setPosts(data.posts),
  })
  function renderItem({ item }: { item: IPost }) {
    return (
      <Post
        title={item.title}
        commentsCount={item._count.comment}
        date={item.created_at}
        likesCount={item.postLike.likeCount}
        onPressPost={() => {
          navigate(Routes.Login, { postId: item.id })
        }}
        postType={item.type}
        isLiked={item.userLike?.liked}
        key={item.slug}
        user={item.user}
        onPressRemove={() => null}
        content={item.content}
        onPressComment={() => null}
        onPressLike={() => null}
      />
    )
  }

  function renderContent() {
    return (
      <FlatList
        data={posts}
        renderItem={renderItem}
        ListHeaderComponent={<Text title>🚀 Öne çıkanlar</Text>}
      />
    )
  }

  return (
    <Page>
      <SkeletonView
        showContent={!fetchPosts.loading}
        template={SkeletonView.templates.LIST_ITEM}
        renderContent={renderContent}
        times={8}
      />
    </Page>
  )
}

export default HomeContainer
