import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe'

export interface IYTPlayerProps {
  videoId: string
}

export function YTPlayer(props: IYTPlayerProps) {
  const { videoId } = props
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
  const [renderYoutubeFrame, setRenderYoutubeFrame] = useState<boolean>(false)

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

  return (
    <TouchableOpacity onPress={() => setRenderYoutubeFrame(true)}>
      {renderYoutubeFrame ? (
        renderYoutube()
      ) : (
        <FastImage
          source={{ uri: thumbnailUrl }}
          style={{
            width: 150,
            height: 100,
            borderRadius: 4,
            marginTop: 20,
            marginRight: 10,
          }}
        />
      )}
    </TouchableOpacity>
  )
}
