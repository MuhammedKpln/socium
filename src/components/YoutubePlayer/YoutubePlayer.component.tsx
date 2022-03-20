import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NativeSyntheticEvent } from 'react-native'
import {
  Image as IM,
  ImageBackground,
  Linking,
  TouchableOpacity,
} from 'react-native'
import ContextMenu, {
  ContextMenuOnPressNativeEvent,
} from 'react-native-context-menu-view'
import View from 'react-native-ui-lib/view'
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe'
import { Icon } from '../Icon/Icon.component'
import { SkeletonView } from '../SkeletonView/SkeletonView.component'
import type { IYTPlayerProps } from './YoutubePlayer.props'

export const YTPlayer = React.memo((props: IYTPlayerProps) => {
  const { videoId } = props
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
  const [renderYoutubeFrame, setRenderYoutubeFrame] = useState<boolean>(false)
  const [showContent, setShowContent] = useState<boolean>(false)
  const fetchYoutubeMeta = useCallback(async () => {
    const youtubeMeta = await getYoutubeMeta(videoId)

    setThumbnailUrl(youtubeMeta.thumbnail_url)
  }, [videoId])
  const contextMenuActions = useMemo(() => {
    return [{ title: 'YouTube ile aç', systemIcon: 'square.and.arrow.up' }]
  }, [])

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
    if (!thumbnailUrl) return

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
        imageStyle={{
          borderRadius: 4,
        }}
        style={{
          width: 150,
          height: 100,
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

  const onPressContextMenuAction = useCallback(
    (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
      if (e.nativeEvent.index === 0) {
        Linking.canOpenURL(`https://www.youtube.com/watch?v=${videoId}`).then(
          supported => {
            if (supported) {
              Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)
            }
          },
        )
      }
    },
    [videoId],
  )

  return (
    <TouchableOpacity onPress={() => setRenderYoutubeFrame(true)}>
      <ContextMenu
        actions={contextMenuActions}
        onPress={onPressContextMenuAction}
      >
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
      </ContextMenu>
    </TouchableOpacity>
  )
})
