import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg width={50} height={50} fill="none" {...props}>
    <Circle cx={25} cy={25} r={25} fill="#FE7949" />
    <Path
      d="M34 37H16a1 1 0 0 1-1-1V14a1 1 0 0 1 1-1h12l7 7v16a1 1 0 0 1-1 1Z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M28 13v7h7M21 26h8M21 30h8"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
