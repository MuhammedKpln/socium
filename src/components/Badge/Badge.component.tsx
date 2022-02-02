import { Colors, Text, View } from 'react-native-ui-lib'
import React from 'react'
import { IBadgeProps } from './Badge.props'
import { useMemo } from 'react'
import { Icon } from '../Icon/Icon.component'

export function Badge(props: IBadgeProps) {
  const { iconName, label, size = 20 } = props

  const backgroundColor = useMemo(
    () => props.backgroundColor ?? Colors.primary,
    [props.backgroundColor],
  )

  return (
    <View
      style={[
        {
          width: size,
          height: props?.label ? size - 5 : size,
          backgroundColor,
          borderRadius: size,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        },
        props.containerStyle,
      ]}
    >
      {iconName && <Icon name={iconName} {...props?.iconProps} />}
      {label && (
        <Text style={{ color: Colors.white }} {...props?.labelProps}>
          {label}
        </Text>
      )}
    </View>
  )
}
