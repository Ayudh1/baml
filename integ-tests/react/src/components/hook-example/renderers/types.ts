import * as React from 'react'

export type ContentRenderer<T, E extends HTMLElement = HTMLDivElement> = (props: {
  hookOutput: T
  placeholder: string
  ref?: React.Ref<E>
}) => React.ReactNode
