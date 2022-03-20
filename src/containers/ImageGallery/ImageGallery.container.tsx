import { ImageGallery } from '@/components/ImageGallery/ImageGallery.component'
import { LoaderScreen } from '@/components/LoaderScreen/LoaderScreen.component'
import type { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'

export function ImageGalleryContainer() {
  const [visible, setVisible] = useState(true)
  const [hideLoader, setHideLoader] = useState(false)
  const route = useRoute<RouteProp<INavigatorParamsList, Routes.ImageGallery>>()

  const onDismiss = () => {
    setVisible(false)
    navigateBack()
  }

  return (
    <>
      {!hideLoader && <LoaderScreen />}
      <ImageGallery
        visible={visible}
        onDismiss={onDismiss}
        imageSet={route.params.imageSet}
        onLoadImages={() => setHideLoader(true)}
      />
    </>
  )
}
