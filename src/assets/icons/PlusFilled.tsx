import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Circle cx={18} cy={18} r={18} fill="#fff" />
    <Path
      d="M36 18a18 18 0 1 1-36 0 18 18 0 0 1 36 0Zm-16.875-7.875a1.125 1.125 0 1 0-2.25 0v6.75h-6.75a1.125 1.125 0 1 0 0 2.25h6.75v6.75a1.125 1.125 0 1 0 2.25 0v-6.75h6.75a1.125 1.125 0 1 0 0-2.25h-6.75v-6.75Z"
      fill="#FE7949"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
