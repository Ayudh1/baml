import { Card } from '@/components/ui/card'
import type { ContentRenderer } from './types'

type ContactInfo = {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export const extractionRenderer: ContentRenderer<ContactInfo, HTMLDivElement> = ({ content, placeholder, ref }) => {
  if (!content) {
    return <Card className='p-4 text-muted-foreground text-sm'>{placeholder}</Card>
  }

  return (
    <Card className='p-4'>
      <div ref={ref} className='space-y-4'>
        {content.name && (
          <div>
            <div className='text-sm font-medium text-muted-foreground'>Name</div>
            <div className='text-lg'>{content.name}</div>
          </div>
        )}
        {content.email && (
          <div>
            <div className='text-sm font-medium text-muted-foreground'>Email</div>
            <div className='text-lg'>{content.email}</div>
          </div>
        )}
        {content.phone && (
          <div>
            <div className='text-sm font-medium text-muted-foreground'>Phone</div>
            <div className='text-lg'>{content.phone}</div>
          </div>
        )}
        {content.address && (
          <div>
            <div className='text-sm font-medium text-muted-foreground'>Address</div>
            <div className='text-lg whitespace-pre-wrap'>{content.address}</div>
          </div>
        )}
      </div>
    </Card>
  )
}
