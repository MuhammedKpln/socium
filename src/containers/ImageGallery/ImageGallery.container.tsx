import { ImageGallery } from '@/components/ImageGallery/ImageGallery.component'
import { INavigatorParamsList, Routes } from '@/navigators/navigator.props'
import { navigateBack } from '@/navigators/utils/navigation'
import { RouteProp, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'

export function ImageGalleryContainer() {
  const [visible, setVisible] = useState(true)
  const route = useRoute<RouteProp<INavigatorParamsList, Routes.ImageGallery>>()

  const onDismiss = () => {
    setVisible(false)
    navigateBack()
  }

  return (
    <ImageGallery
      visible={visible}
      onDismiss={onDismiss}
      imageSet={route.params.imageSet}
    />
  )
}
