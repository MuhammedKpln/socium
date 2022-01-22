import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Carousel from 'react-native-ui-lib/carousel'
import Image from 'react-native-ui-lib/image'
import Modal from 'react-native-ui-lib/modal'
import Text from 'react-native-ui-lib/text'
import TouchableOpacity from 'react-native-ui-lib/touchableOpacity'
import View from 'react-native-ui-lib/view'

interface IProps {
  imageSet: string[]
  visible: boolean
  onDismiss: () => void
}

export function ImageGallery(props: IProps) {
  return (
    <Modal
      visible={props.visible}
      onDismiss={props.onDismiss}
      onBackgroundPress={props.onDismiss}
      transparent
      overlayBackgroundColor="rgba(0, 0, 0, 0.5)"
      presentationStyle="overFullScreen"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <SafeAreaView style={{ padding: 30 }}>
        <TouchableOpacity onPress={props.onDismiss}>
          <Text
            font28
            white
            fontGilroyBold
            style={{
              alignSelf: 'flex-end',
            }}
          >
            X
          </Text>
        </TouchableOpacity>
        <Carousel
          horizontal
          animated
          style={{ height: '40%', marginTop: '60%' }}
          showCounter
        >
          {props?.imageSet?.map((image, index) => (
            <View flex key={index}>
              <Image
                overlayType={Image.overlayTypes.BOTTOM}
                style={{ width: '100%', height: '100%' }}
                source={{
                  uri: image,
                }}
              />
            </View>
          ))}
        </Carousel>
      </SafeAreaView>
    </Modal>
  )
}
