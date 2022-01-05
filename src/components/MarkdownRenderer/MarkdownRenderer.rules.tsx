import React from 'react'
import { getUniqueID, renderRules } from 'react-native-markdown-renderer'
import Text from 'react-native-ui-lib/text'

export const MarkdownRendererRules = {
  ...renderRules,
  textgroup: (_: any, children: any) => (
    <Text textColor key={getUniqueID()}>
      {children}
    </Text>
  ),
}
