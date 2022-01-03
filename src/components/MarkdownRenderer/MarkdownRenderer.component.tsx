import React from 'react'
import Markdown from 'react-native-markdown-renderer'
import { IMarkdownRendererProps } from './MarkdownRenderer.props'
import { MarkdownRendererRules } from './MarkdownRenderer.rules'

function _MarkdownRenderer(props: IMarkdownRendererProps) {
  const { children } = props
  return (
    <Markdown rules={MarkdownRendererRules} {...props}>
      {children}
    </Markdown>
  )
}

export const MarkdownRenderer = React.memo(_MarkdownRenderer)
