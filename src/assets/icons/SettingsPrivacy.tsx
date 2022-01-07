import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg width={50} height={50} fill="none" {...props}>
    <Circle cx={25} cy={25} r={25} fill="#FE7949" />
    <Path
      d="M14 23.337V16a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v7.337c0 10.5-8.913 13.976-10.688 14.563a.9.9 0 0 1-.625 0C22.913 37.313 14 33.837 14 23.337Z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m30.5 22-7.337 7-3.663-3.5"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
