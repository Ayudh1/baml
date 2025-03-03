import { Card } from '@/components/ui/card'
import type { ContentRenderer } from './types'

export const streamRenderer: ContentRenderer<any> = ({ hookOutput, placeholder, ref }) => {
  if (!hookOutput) {
    return <Card className='p-4 text-muted-foreground text-sm'>{placeholder}</Card>
  }

  return (
    <Card className='p-4'>
      <div
        ref={ref}
        className='whitespace-pre-wrap font-mono text-sm bg-transparent max-h-[60vh] overflow-y-auto text-primary'
      >
        {typeof hookOutput === 'string' ? hookOutput : JSON.stringify(hookOutput, null, 2)}
      </div>
    </Card>
  )
}
