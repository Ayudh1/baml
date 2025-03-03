import type { FunctionNames, HookInput, HookOutput } from '../../../baml_client/react/hooks'
import type { ContentRenderer } from './renderers'

export type HookConfig<T extends FunctionNames> = {
  name: T
  hook: {
    (props: HookInput<T, { stream: false }>): HookOutput<T, { stream: false }>
    (props?: HookInput<T, { stream?: true }>): HookOutput<T, { stream: true }>
  }
  renderers?: {
    data?: ContentRenderer<any, any>
    streamData?: ContentRenderer<any, any>
    finalData?: ContentRenderer<any, any>
  }
  description: string
}
