import { createSlice } from '@reduxjs/toolkit'

export enum FeatureHighlights {
  ChatComponent = 'chat-component',
  DiscoverPosts = 'discover-posts',
  Pair = 'pair',
  EarnStar = 'earn-star',
}

interface IFeatureHighlight {
  componentName: string
  highlighted: boolean
}

interface IState {
  features: IFeatureHighlight[]
}

interface IGetFeaturePayload {
  payload: {
    componentName: FeatureHighlights
  }
}

const initialState: IState = {
  features: [],
}

const featureHighlightSlice = createSlice({
  name: 'featureHighlight',
  initialState,

  reducers: {
    featureHighlighted: (state, { payload }: IGetFeaturePayload) => {
      const feature = state.features.filter(
        v => v.componentName === payload.componentName,
      )

      if (feature.length > 0) {
        feature[0].highlighted = true
      } else {
        state.features.push({
          componentName: payload.componentName,
          highlighted: true,
        })
      }
    },
  },
})

export const { featureHighlighted } = featureHighlightSlice.actions

export default featureHighlightSlice.reducer
