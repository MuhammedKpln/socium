import React, { useCallback, useEffect, useState } from 'react'
import { Image as IM, ImageBackground, TouchableOpacity } from 'react-native'
import SkeletonView from 'react-native-ui-lib/skeletonView'
import View from 'react-native-ui-lib/view'
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe'
import { Icon } from '../Icon/Icon.component'
import { IYTPlayerProps } from './YoutubePlayer.props'

export const YTPlayer = React.memo((props: IYTPlayerProps) => {
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
    IM.prefetch(thumbnailUrl).then(val => {
      if (val) {
        setShowContent(true)
      }
    })
  }, [thumbnailUrl])

  const renderContent = useCallback(() => {
    return (
      <ImageBackground
        source={{ uri: thumbnailUrl }}
        style={{
          width: 150,
          height: 100,
          borderRadius: 4,
          marginTop: 20,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <Icon name="play-circle" size={30} color="#fff" />
      </ImageBackground>
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
})
