import React, { useCallback, useEffect, useState } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import SkeletonView from 'react-native-ui-lib/skeletonView'
import View from 'react-native-ui-lib/view'
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe'
import { IYTPlayerProps } from './YoutubePlayer.props'

export function YTPlayer(props: IYTPlayerProps) {
  const { videoId } = props
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
  const [renderYoutubeFrame, setRenderYoutubeFrame] = useState<boolean>(false)
  const [showContent, setShowContent] = useState<boolean>(false)
  const fetchYoutubeMeta = useCallback(async () => {
    const youtubeMeta = await getYoutubeMeta(videoId)

    setThumbnailUrl(youtubeMeta.thumbnail_url)
  }, [videoId])

  const renderYoutube = useCallback(() => {
    return (
      <YoutubePlayer
        forceAndroidAutoplay={true}
        videoId={videoId}
        allowWebViewZoom={false}
        contentScale={0.5}
        height={150}
        play={renderYoutubeFrame}
        initialPlayerParams={{
          controls: false,
          preventFullScreen: true,
          loop: false,
          modestbranding: false,
          showClosedCaptions: false,
        }}
        webViewStyle={{
          borderRadius: 4,
          marginTop: 20,
          marginRight: 10,
        }}
      />
    )
  }, [videoId, renderYoutubeFrame])

  useEffect(() => {
    fetchYoutubeMeta()
  }, [fetchYoutubeMeta])

  useEffect(() => {
    Image.prefetch(thumbnailUrl).then(val => {
      if (val) {
        setShowContent(true)
      }
    })
  }, [thumbnailUrl])

  const renderContent = useCallback(() => {
    return (
      <Image
        source={{ uri: thumbnailUrl }}
        style={{
          width: 150,
          height: 100,
          borderRadius: 4,
          marginTop: 20,
          marginRight: 10,
        }}
      />
    )
  }, [thumbnailUrl])

  return (
    <TouchableOpacity onPress={() => setRenderYoutubeFrame(true)}>
      {renderYoutubeFrame ? (
        renderYoutube()
      ) : (
        <View marginT-20>
          <SkeletonView
            width={150}
            height={100}
            showContent={showContent}
            renderContent={renderContent}
          />
        </View>
      )}
    </TouchableOpacity>
  )
}
