import { wait } from '@/utils/utils'
import React, { useEffect, useState } from 'react'
import type { SkeletonViewProps } from 'react-native-ui-lib'
import SKView from 'react-native-ui-lib/skeletonView'

export function SkeletonView(props: SkeletonViewProps) {
  const { showContent } = props
  const [showIt, setShowIt] = useState(false)

  useEffect(() => {
    if (showContent) {
      wait(100).then(() => setShowIt(true))
    }
  }, [showContent])

  if (!showIt) {
    return <SKView {...props} showContent={false} renderContent={() => null} />
  } else {
    if (props.renderContent) {
      return <>{props.renderContent()}</>
    }
    return null
  }
}

export const SkeletonViewTemplates = SKView.templates
export const SkeletonViewContentTypes = SKView.contentTypes
