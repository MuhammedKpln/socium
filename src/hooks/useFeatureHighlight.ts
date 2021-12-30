import { useAppSelector } from '@/store'
import {
  featureHighlighted,
  FeatureHighlights,
} from '@/store/reducers/featureHighlight.reducer'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export function useFeatureHighlight(
  componentName: FeatureHighlights,
  titles: string[],
  messages: string[],
) {
  const [showFTE, setShowFTE] = useState<boolean>(true)
  const [disabled, setDisable] = useState<boolean>(false)
  const [currentTargetIndex, setCurrentTargetIndex] = useState<number>(0)
  const [targets, setTargets] = useState<{ [key: string]: any }>([])
  const _features = useAppSelector(
    state => state.featureHightlightReducer.features,
  )
  const dispatch = useDispatch()

  const getFeature = useCallback(
    (_componentName: string) => {
      const feature = _features.filter(v => v.componentName === _componentName)
      if (feature.length > 0) {
        return feature[0]
      }

      return null
    },
    [_features],
  )

  useEffect(() => {
    const feature = getFeature(componentName)
    console.log('Q', feature)
    if (feature) {
      if (feature.highlighted) {
        setDisable(true)
      }
    }
  }, [componentName, getFeature])

  useEffect(() => {
    console.log('Qq', disabled)

    if (disabled) {
      setShowFTE(false)
    }
  }, [disabled])

  const featureHighlightProps = useCallback(() => {
    const moveToPage = (index: number) => {
      console.log(index, targets.length)
      if (index < targets.length) {
        setCurrentTargetIndex(index)
      } else if (index === targets.length) {
        dispatch(
          featureHighlighted({
            componentName,
          }),
        )
        setShowFTE(false)
      } else {
        setShowFTE(false)
      }
    }

    const moveNext = () => {
      const newTargetIndex = currentTargetIndex + 1

      moveToPage(newTargetIndex)
    }

    return {
      visible: showFTE && !disabled,
      getTarget: () => targets[currentTargetIndex],
      title: titles[currentTargetIndex],
      message: messages[currentTargetIndex],
      confirmButtonProps: {
        label: 'Anlaşıldı!',
        onPress: moveNext,
      },
    }
  }, [
    componentName,
    currentTargetIndex,
    disabled,
    dispatch,
    messages,
    showFTE,
    targets,
    titles,
  ])

  function addTarget(ref: any, id: number) {
    if (!targets[id]) {
      targets[id] = ref
      setTargets(targets)
    }
  }
  return {
    addTarget,
    showFTE,
    featureHighlightProps,
    targets,
    setShowFTE,
  }
}
