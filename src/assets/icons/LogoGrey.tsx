import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'
import { memo } from 'react'

const SvgComponent = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      d="M8.612 25c-1.218 0-2.156-.28-2.812-.84-.633-.559-.949-1.188-.949-1.887 0-.606.223-1.13.668-1.574.445-.443 1.101-.664 1.968-.664.305 0 .657.035 1.055.105l.949.105a4.294 4.294 0 0 0-.422-1.713 7.4 7.4 0 0 0-.914-1.539 19.043 19.043 0 0 0-1.054-1.329c-.727 1.376-1.453 2.518-2.18 3.427a24.14 24.14 0 0 1-2.32 2.587c-.422.42-.867.63-1.336.63-.374 0-.68-.128-.913-.385A1.527 1.527 0 0 1 0 20.91c0-.466.164-.897.492-1.294l.457-.56c1.289-1.584 2.262-2.89 2.918-3.915.398-.676.867-1.574 1.406-2.692a99.875 99.875 0 0 0 1.582-3.532C7.3 7.89 8.225 7.378 9.632 7.378c.656 0 1.113.058 1.37.174.258.117.387.303.387.56 0 .14-.047.361-.14.664a5.039 5.039 0 0 1-.387.91c-.422.838-.633 1.55-.633 2.132 0 .35.117.734.352 1.154.258.42.644.944 1.16 1.574.75.979 1.312 1.818 1.687 2.517.398.676.598 1.422.598 2.238 0 .233-.024.56-.07.979 1.148-.443 2.495-1.62 4.042-3.532.281-.326.597-.49.949-.49.305 0 .539.14.703.42.187.28.281.665.281 1.154 0 .886-.222 1.609-.668 2.168-1.171 1.445-2.296 2.436-3.374 2.972-1.055.513-2.367.793-3.937.84-.938.792-2.05 1.188-3.34 1.188Z"
      fill="#E0E0E0"
    />
    <Path
      d="M35.003 13.322c.304 0 .539.151.703.454.164.303.246.688.246 1.154 0 1.119-.34 1.783-1.02 1.993-1.406.49-2.952.77-4.64.84-.445 1.957-1.324 3.53-2.636 4.72-1.312 1.165-2.8 1.748-4.464 1.748-1.406 0-2.613-.338-3.62-1.014a6.496 6.496 0 0 1-2.25-2.692c-.516-1.12-.774-2.331-.774-3.637 0-1.772.34-3.345 1.02-4.72.68-1.399 1.616-2.483 2.812-3.252a7.034 7.034 0 0 1 3.972-1.189c1.78 0 3.21.618 4.288 1.853 1.102 1.213 1.746 2.716 1.934 4.51 1.101-.069 2.413-.302 3.937-.698.187-.047.351-.07.492-.07Zm-11.53 7.203c.75 0 1.394-.304 1.933-.91.563-.606.938-1.48 1.125-2.622a4.97 4.97 0 0 1-1.687-1.923 5.815 5.815 0 0 1-.563-2.518c0-.372.036-.745.106-1.118h-.176c-.937 0-1.722.454-2.355 1.363-.61.886-.914 2.145-.914 3.776 0 1.282.246 2.261.738 2.938.516.675 1.113 1.014 1.793 1.014Z"
      fill="#E0E0E0"
    />
    <Path
      d="M39.649 24.23c-2.297 0-4.09-.64-5.378-1.922-1.266-1.306-1.898-3.019-1.898-5.14 0-1.888.375-3.543 1.124-4.965.75-1.422 1.723-2.518 2.918-3.287 1.195-.77 2.449-1.154 3.761-1.154 1.29 0 2.285.385 2.988 1.154.727.746 1.09 1.713 1.09 2.902 0 .98-.223 1.807-.668 2.483-.422.676-.984 1.014-1.687 1.014-.446 0-.809-.105-1.09-.315-.258-.21-.387-.501-.387-.874 0-.163.024-.35.07-.56.047-.21.083-.36.106-.454.117-.35.176-.676.176-.98 0-.302-.082-.535-.246-.698-.14-.164-.352-.245-.633-.245-.539 0-1.043.245-1.512.734-.468.466-.843 1.107-1.124 1.923-.282.816-.422 1.713-.422 2.692 0 2.704 1.183 4.056 3.55 4.056.961 0 1.992-.314 3.093-.944 1.125-.652 2.227-1.62 3.305-2.902.281-.326.597-.49.949-.49.305 0 .539.14.703.42.188.28.281.665.281 1.154 0 .886-.222 1.609-.668 2.168a11.532 11.532 0 0 1-3.972 3.147c-1.523.723-3 1.084-4.429 1.084Z"
      fill="#E0E0E0"
    />
    <Path
      d="M50.482 5.455c-.985 0-1.723-.222-2.215-.665-.492-.466-.738-1.107-.738-1.923 0-.816.316-1.492.949-2.028C49.134.28 49.943 0 50.903 0c.867 0 1.57.21 2.11.63.538.419.808 1.013.808 1.783 0 .932-.305 1.678-.914 2.237-.61.536-1.418.805-2.425.805ZM50.2 24.23c-1.523 0-2.636-.536-3.34-1.609-.679-1.072-1.018-2.494-1.018-4.265 0-1.05.128-2.39.386-4.021a39.532 39.532 0 0 1 1.055-4.616c.21-.746.492-1.258.843-1.538.352-.28.914-.42 1.688-.42 1.195 0 1.792.397 1.792 1.19 0 .582-.222 1.934-.668 4.055-.562 2.564-.843 4.3-.843 5.21 0 .7.094 1.235.281 1.608.188.373.504.56.95.56.421 0 .948-.292 1.581-.875.633-.582 1.476-1.503 2.531-2.762.281-.326.598-.49.95-.49.304 0 .538.14.702.42.188.28.281.665.281 1.154 0 .933-.222 1.655-.668 2.168-2.32 2.82-4.487 4.23-6.503 4.23Z"
      fill="#E0E0E0"
    />
    <Path
      d="M58.113 24.23c-1.055 0-1.922-.477-2.601-1.433-.657-.979-.985-2.19-.985-3.636 0-1.748.117-3.345.352-4.79.234-1.469.62-3.019 1.16-4.65.234-.7.562-1.201.984-1.504.422-.303 1.09-.455 2.004-.455.515 0 .867.082 1.054.245.211.163.317.408.317.734 0 .187-.13.816-.387 1.888a36.373 36.373 0 0 0-.562 2.343c-.47 2.448-.703 4.08-.703 4.895 0 .49.058.84.175 1.05.117.186.305.279.563.279.351 0 .785-.35 1.3-1.05.54-.698 1.102-1.76 1.688-3.181.609-1.422 1.195-3.17 1.757-5.245.188-.699.469-1.2.844-1.503.398-.303.984-.455 1.758-.455.538 0 .913.07 1.124.21.211.117.317.35.317.7 0 .582-.293 2.179-.879 4.79-.656 2.983-.984 4.825-.984 5.524 0 .443.093.793.28 1.049.188.233.435.35.74.35.468 0 1.019-.28 1.651-.84.656-.582 1.523-1.515 2.602-2.797.28-.326.597-.49.949-.49.304 0 .539.14.703.42.187.28.28.665.28 1.154 0 .933-.222 1.655-.667 2.168-1.008 1.235-2.097 2.25-3.27 3.042-1.148.792-2.46 1.189-3.936 1.189-1.125 0-1.957-.432-2.496-1.294-.515-.862-.773-2.075-.773-3.636-.399 1.585-.996 2.809-1.793 3.671-.797.84-1.652 1.259-2.566 1.259Z"
      fill="#E0E0E0"
    />
    <Path
      d="M73.26 24.23c-.89 0-1.523-.465-1.898-1.398-.351-.932-.527-2.424-.527-4.475 0-3.03.433-5.91 1.3-8.637.211-.676.551-1.165 1.02-1.468.492-.327 1.172-.49 2.039-.49.468 0 .796.059.984.175.187.117.281.338.281.664 0 .373-.176 1.213-.527 2.518a53.334 53.334 0 0 0-.563 2.447c-.14.676-.257 1.527-.351 2.553.633-1.818 1.383-3.357 2.25-4.615.89-1.26 1.792-2.192 2.706-2.798.938-.63 1.816-.944 2.637-.944.82 0 1.394.187 1.722.56.352.373.528.944.528 1.713 0 .746-.223 2.098-.668 4.056-.188.84-.317 1.468-.387 1.888.773-1.958 1.629-3.555 2.566-4.79.96-1.236 1.898-2.11 2.812-2.623.914-.536 1.758-.804 2.531-.804.75 0 1.313.198 1.687.595.399.373.598.932.598 1.678 0 .606-.129 1.748-.387 3.426a75.883 75.883 0 0 0-.562 4.056 38.385 38.385 0 0 0-.211 4.231c0 .886-.188 1.527-.563 1.923-.351.373-.937.56-1.757.56-.773 0-1.336-.198-1.687-.595-.352-.396-.528-.99-.528-1.783 0-.932.164-2.47.492-4.615.282-1.865.422-3.054.422-3.567 0-.373-.129-.56-.386-.56-.305 0-.739.397-1.301 1.19-.562.769-1.125 1.795-1.687 3.077a25.027 25.027 0 0 0-1.371 4.056c-.258 1.118-.563 1.864-.914 2.237-.328.373-.867.56-1.617.56-.773 0-1.36-.362-1.758-1.084-.375-.746-.562-1.643-.562-2.692 0-.886.117-2.168.351-3.847.188-1.492.282-2.47.282-2.937 0-.373-.13-.56-.387-.56-.352 0-.797.42-1.336 1.26-.539.839-1.066 1.911-1.582 3.216a32.765 32.765 0 0 0-1.195 3.847c-.258 1.095-.562 1.841-.914 2.237-.328.373-.855.56-1.582.56Z"
      fill="#E0E0E0"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo