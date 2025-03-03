'use client'

import { NetworkTimeline } from '@/components/network-timeline'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import * as React from 'react'
import type { FunctionNames, HookOutput } from '../../../baml_client/react/hooks'
import { ContentRenderer, defaultRenderer } from './renderers'

type ResponseCardProps = {
  hookResult: HookOutput<FunctionNames>
  hasStarted: boolean
  visibleSections: {
    data: boolean
    streamData: boolean
    finalData: boolean
    error: boolean
    networkTimeline: boolean
    showDescriptions: boolean
  }
  renderers?: {
    data?: ContentRenderer<any>
    streamData?: ContentRenderer<any>
    finalData?: ContentRenderer<any>
  }
}

function formatError(error: any): { title: string; message: string; status_code?: number } {
  if (!error) return { title: 'No error', message: 'No error available' }

  try {
    // If error is a string, return it directly
    if (typeof error === 'string') {
      return { title: 'Error', message: error }
    }

    // Parse error if it's a string representation of JSON
    const errorObj = typeof error === 'string' ? JSON.parse(error) : error

    // Extract the most relevant information
    const title = errorObj.name || 'Error'
    let message = errorObj.message || ''

    // If the message contains a nested error structure, try to extract the actual message
    if (message.includes('BamlError:')) {
      // Extract the actual error message from nested structure
      const matches = message.match(/message: Some\(\s*"([^"]+)"\s*\)/)
      if (matches && matches[1]) {
        message = matches[1]
      }
    }

    // Add client name if available
    if (errorObj.client_name) {
      message = `${message}\nClient: ${errorObj.client_name}`
    }

    return {
      title,
      message,
      status_code: errorObj.status_code,
    }
  } catch (e) {
    // Fallback for any parsing errors
    return {
      title: 'Error',
      message: String(error),
    }
  }
}

export function ResponseCard({ hookResult, hasStarted, visibleSections, renderers = {} }: ResponseCardProps) {
  const { isLoading, error, isError, data, streamData, isPending, isStreaming, isSuccess, finalData } = hookResult

  const sectionDescriptions = {
    data: {
      streaming: 'Shows partial responses as they arrive',
      nonStreaming: 'Shows final response',
    },
    streamData: {
      streaming: 'Shows partial responses as they arrive',
      nonStreaming: 'Not available',
    },
    finalData: {
      streaming: 'Shows final response when finished',
      nonStreaming: 'Shows final response',
    },
    error: 'Any errors that occurred during the request',
  } as const

  const dataRef = React.useRef<HTMLDivElement>(null)
  const streamDataRef = React.useRef<HTMLDivElement>(null)
  const finalDataRef = React.useRef<HTMLDivElement>(null)
  const errorRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll effects remain the same
  React.useEffect(() => {
    if (dataRef.current) {
      dataRef.current.scrollTop = dataRef.current.scrollHeight
    }
  }, [data])

  React.useEffect(() => {
    if (streamDataRef.current) {
      streamDataRef.current.scrollTop = streamDataRef.current.scrollHeight
    }
  }, [streamData])

  React.useEffect(() => {
    if (finalDataRef.current) {
      finalDataRef.current.scrollTop = finalDataRef.current.scrollHeight
    }
  }, [finalData])

  const renderContent = (
    ref: React.RefObject<HTMLDivElement | null>,
    content: any,
    placeholder: string,
    type: 'data' | 'streamData' | 'finalData',
  ) => {
    const renderer = renderers[type] || defaultRenderer
    return renderer({ hookOutput: content, placeholder, ref })
  }

  const renderError = () =>
    error ? (
      <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
        <Alert variant='destructive'>
          <AlertDescription>
            {(() => {
              const { title, message, status_code } = formatError(error)
              return (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='font-semibold break-words'>{title}</div>
                    {status_code && <Badge variant={'destructive'}>{status_code}</Badge>}
                  </div>
                  <pre className='whitespace-pre-wrap font-mono text-sm break-words'>{message}</pre>
                </div>
              )
            })()}
          </AlertDescription>
        </Alert>
      </div>
    ) : (
      <pre className='whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg max-h-[60vh] overflow-y-auto'>
        No error available
      </pre>
    )

  const columns =
    Object.values({ ...visibleSections, networkTimeline: false, showDescriptions: false }).filter(Boolean).length || 1

  return (
    <div className='flex flex-col gap-6'>
      {visibleSections.networkTimeline && (
        <div className='max-w-xl mx-auto w-full'>
          <NetworkTimeline hookResult={hookResult} hasStarted={hasStarted} />
        </div>
      )}

      {/* Desktop View */}
      <div className='hidden md:block min-w-full space-y-2 mx-auto'>
        <div
          className='grid gap-4'
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {visibleSections.data && (
            <div className='space-y-2'>
              <div>
                <h3 className='font-medium'>Data</h3>
                {visibleSections.showDescriptions && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-muted-foreground/70'>Streaming: </span>
                      {sectionDescriptions.data.streaming}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-muted-foreground/70'>Not streaming: </span>
                      {sectionDescriptions.data.nonStreaming}
                    </p>
                  </div>
                )}
              </div>
              {renderContent(dataRef, data, 'No data available', 'data')}
            </div>
          )}

          {visibleSections.streamData && (
            <div className='space-y-2'>
              <div>
                <h3 className='font-medium'>Stream Data</h3>
                {visibleSections.showDescriptions && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-muted-foreground/70'>Streaming: </span>
                      {sectionDescriptions.streamData.streaming}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-muted-foreground/70'>Not streaming: </span>
                      {sectionDescriptions.streamData.nonStreaming}
                    </p>
                  </div>
                )}
              </div>
              {renderContent(streamDataRef, streamData, 'No streaming data available', 'streamData')}
            </div>
          )}

          {visibleSections.finalData && (
            <div className='space-y-2'>
              <div>
                <h3 className='font-medium'>Final Data</h3>
                {visibleSections.showDescriptions && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-muted-foreground/70'>Streaming: </span>
                      {sectionDescriptions.finalData.streaming}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      <span className='font-medium text-muted-foreground/70'>Not streaming: </span>
                      {sectionDescriptions.finalData.nonStreaming}
                    </p>
                  </div>
                )}
              </div>
              {renderContent(finalDataRef, finalData, 'No final data available', 'finalData')}
            </div>
          )}

          {visibleSections.error && (
            <div className='space-y-2'>
              <div>
                <h3 className='font-medium'>Error</h3>
                {visibleSections.showDescriptions && (
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>{sectionDescriptions.error}</p>
                    <p className='text-sm text-muted-foreground'>&nbsp;</p>
                  </div>
                )}
              </div>
              {renderError()}
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className='md:hidden min-w-full'>
        <Tabs defaultValue='data' className='w-full'>
          <TabsList
            className='grid w-full'
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {visibleSections.data && <TabsTrigger value='data'>Data</TabsTrigger>}
            {visibleSections.streamData && <TabsTrigger value='stream'>Stream</TabsTrigger>}
            {visibleSections.finalData && <TabsTrigger value='final'>Final</TabsTrigger>}
            {visibleSections.error && <TabsTrigger value='error'>Error</TabsTrigger>}
          </TabsList>

          {visibleSections.data && (
            <TabsContent value='data' className='space-y-2'>
              {visibleSections.showDescriptions && (
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-muted-foreground/70'>Streaming: </span>
                    {sectionDescriptions.data.streaming}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-muted-foreground/70'>Not streaming: </span>
                    {sectionDescriptions.data.nonStreaming}
                  </p>
                </div>
              )}
              {renderContent(dataRef, data, 'No data available', 'data')}
            </TabsContent>
          )}

          {visibleSections.streamData && (
            <TabsContent value='stream' className='space-y-2'>
              {visibleSections.showDescriptions && (
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-muted-foreground/70'>Streaming: </span>
                    {sectionDescriptions.streamData.streaming}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-muted-foreground/70'>Not streaming: </span>
                    {sectionDescriptions.streamData.nonStreaming}
                  </p>
                </div>
              )}
              {renderContent(streamDataRef, streamData, 'No streaming data available', 'streamData')}
            </TabsContent>
          )}

          {visibleSections.finalData && (
            <TabsContent value='final' className='space-y-2'>
              {visibleSections.showDescriptions && (
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-muted-foreground/70'>Streaming: </span>
                    {sectionDescriptions.finalData.streaming}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium text-muted-foreground/70'>Not streaming: </span>
                    {sectionDescriptions.finalData.nonStreaming}
                  </p>
                </div>
              )}
              {renderContent(finalDataRef, finalData, 'No final data available', 'finalData')}
            </TabsContent>
          )}

          {visibleSections.error && (
            <TabsContent value='error' className='space-y-2'>
              {visibleSections.showDescriptions && (
                <div className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>{sectionDescriptions.error}</p>
                  <p className='text-sm text-muted-foreground'>&nbsp;</p>
                </div>
              )}
              {renderError()}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
