import * as React from 'react'
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={24 || props.width}
    height={24 || props.height}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        d="M33.382 3.743A4.29 4.29 0 0 0 30.36.723C27.712 0 17.05 0 17.05 0S6.392.022 3.742.744a4.29 4.29 0 0 0-3.02 3.021C-.08 8.472-.391 15.643.743 20.161a4.29 4.29 0 0 0 3.02 3.021c2.65.723 13.31.723 13.31.723s10.66 0 13.31-.723a4.292 4.292 0 0 0 3.02-3.02c.846-4.714 1.106-11.88-.021-16.419Z"
        fill="red"
      />
      <Path d="m13.658 17.075 8.844-5.123-8.844-5.122v10.245Z" fill="#fff" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h34.138v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
