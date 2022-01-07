import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg width={50} height={50} fill="none" {...props}>
    <Circle cx={25} cy={25} r={25} fill="#FD5D5D" />
    <Path
      d="M25 15v9.5M31 15.775a11 11 0 1 1-12 0"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
