import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg width={50} height={50} fill="none" {...props}>
    <Circle cx={25} cy={25} r={25} fill="#FE7949" />
    <Path
      d="M21 37h8M16.025 22a8.986 8.986 0 0 1 9.037-9c4.95.037 8.913 4.15 8.913 9.113V23c0 4.475.937 7.075 1.762 8.5a1 1 0 0 1-.862 1.5h-19.75a1 1 0 0 1-.863-1.5c.825-1.425 1.763-4.025 1.763-8.5v-1Z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
