import * as React from 'react'
import Svg, { SvgProps, Circle, Path } from 'react-native-svg'
import { memo } from 'react'

const SettingsMoon = (props: SvgProps) => (
  <Svg width={50} height={50} fill="none" {...props}>
    <Circle cx={25} cy={25} r={25} fill="#FE7949" />
    <Path
      d="M37.087 28.075a11.487 11.487 0 0 1-14.162-14.162 11.5 11.5 0 1 0 14.162 14.162v0Z"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const Memo = memo(SettingsMoon)
export default Memo
