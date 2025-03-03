import { useClassifyMessage, useExtractContactInfo, useTellStory, useTestAws } from '../../../baml_client/react/hooks'
import { classificationRenderer } from './renderers/classification'
import { extractionRenderer } from './renderers/extraction'
import { streamRenderer } from './renderers/stream'
import type { HookConfig } from './types'

export const AVAILABLE_HOOKS = {
  chat: {
    name: 'Write a story' as const,
    hook: useTestAws,
    renderers: {
      streamData: streamRenderer,
    },
    description: 'A input field with streaming responses',
  },
  classification: {
    name: 'Classify Message' as const,
    hook: useClassifyMessage,
    renderers: {
      data: classificationRenderer,
      streamData: classificationRenderer,
      finalData: classificationRenderer,
    },
    description: 'Classify text into predefined categories',
  },
  extraction: {
    name: 'Extract Contact Info' as const,
    hook: useExtractContactInfo,
    renderers: {
      data: extractionRenderer,
      streamData: extractionRenderer,
      finalData: extractionRenderer,
    },
    description: 'Extract structured data from text',
  },
  summarization: {
    name: 'Summarize' as const,
    hook: useTellStory,
    renderers: {
      streamData: streamRenderer,
    },
    description: 'Generate summaries and stories',
  },
} as const

export type HookType = keyof typeof AVAILABLE_HOOKS
