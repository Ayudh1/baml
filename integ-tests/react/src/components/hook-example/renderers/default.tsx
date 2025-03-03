import type { ContentRenderer } from './types'

export const defaultRenderer: ContentRenderer<any> = ({ hookOutput, placeholder, ref }) => (
  <div ref={ref} className='whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg max-h-[60vh] overflow-y-auto'>
    {hookOutput ? (typeof hookOutput === 'string' ? hookOutput : JSON.stringify(hookOutput, null, 2)) : placeholder}
  </div>
)
