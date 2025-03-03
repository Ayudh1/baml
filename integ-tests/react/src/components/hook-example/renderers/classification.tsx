import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { ContentRenderer } from './types'

type ClassificationResult = {
  category: string
  confidence: number
}

export const classificationRenderer: ContentRenderer<ClassificationResult, HTMLDivElement> = ({
  content,
  placeholder,
  ref,
}) => {
  if (!content) {
    return <Card className='p-4 text-muted-foreground text-sm'>{placeholder}</Card>
  }

  return (
    <Card className='p-4'>
      <div ref={ref} className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Badge variant='default' className='text-lg'>
            {content.category}
          </Badge>
          <Badge variant='secondary'>{Math.round(content.confidence * 100)}% confidence</Badge>
        </div>
        <pre className='whitespace-pre-wrap font-mono text-sm bg-transparent text-primary'>
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </Card>
  )
}
