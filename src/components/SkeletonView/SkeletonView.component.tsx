import { wait } from '@/utils/utils'
import React, { useEffect, useState } from 'react'
import { SkeletonViewProps } from 'react-native-ui-lib'
import SKView from 'react-native-ui-lib/skeletonView'

export function SkeletonView(props: SkeletonViewProps) {
  const { showContent } = props
  const [showIt, setShowIt] = useState(false)

  useEffect(() => {
    if (showContent) {
      wait(1000).then(() => setShowIt(true))
    }
  }, [showContent])

  return <SKView {...props} showContent={showIt} />
}

export const SkeletonViewTemplates = SKView.templates
export const SkeletonViewContentTypes = SKView.contentTypes
