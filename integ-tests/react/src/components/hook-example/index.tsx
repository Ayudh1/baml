'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Send, Settings, X } from 'lucide-react'
import * as React from 'react'
import { AVAILABLE_HOOKS, type HookType } from './hooks'
import { ResponseCard } from './response-card'

type TestClientProps = {
  hookType: HookType
}

export default function TestClient({ hookType }: TestClientProps) {
  const [isStreamingEnabled, setIsStreamingEnabled] = React.useState(true)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [visibleSections, setVisibleSections] = React.useState({
    data: true,
    streamData: true,
    finalData: true,
    error: true,
    networkTimeline: true,
    showDescriptions: true,
  })

  const hookConfig = AVAILABLE_HOOKS[hookType]
  const hookResult = hookConfig.hook({
    stream: isStreamingEnabled as true,
  })

  const { isLoading, error, isError, isSuccess, mutate, status, data, streamData } = hookResult
  const [prompt, setPrompt] = React.useState('')
  const [hasStarted, setHasStarted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setHasStarted(true)
    await mutate(prompt)
  }

  // Reset hasStarted when the request is complete or reset
  React.useEffect(() => {
    if (!isLoading && !streamData && !data && !error) {
      setHasStarted(false)
    }
  }, [isLoading, streamData, data, error])

  return (
    <div className='flex flex-col gap-6 w-full'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex max-w-xl mx-auto'>
          <Label htmlFor='prompt' className='self-end'>
            Write a story about
          </Label>
        </div>
        <div className='flex gap-2 max-w-xl mx-auto'>
          <Input
            id='prompt'
            type='text'
            autoComplete='off'
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
            placeholder='A cat in a hat...'
            disabled={isLoading}
            className='flex-1'
          />
          {!isSuccess && !isError && (
            <Button type='submit' disabled={isLoading || !prompt.trim()} size='icon'>
              {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='w-4 h-4' />}
            </Button>
          )}
          {(isSuccess || isError) && (
            <Button
              variant='outline'
              size='icon'
              disabled={isLoading}
              onClick={() => {
                setHasStarted(false)
                hookResult.reset()
              }}
            >
              <X className='w-4 h-4' />
            </Button>
          )}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Settings className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56' onCloseAutoFocus={(e) => e.preventDefault()}>
              <DropdownMenuLabel>Response Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={isStreamingEnabled}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={setIsStreamingEnabled}
              >
                Stream Response
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>View Sections</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuCheckboxItem
                checked={visibleSections.networkTimeline}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => setVisibleSections((prev) => ({ ...prev, networkTimeline: checked }))}
              >
                Show LLM Timeline
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSections.showDescriptions}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => setVisibleSections((prev) => ({ ...prev, showDescriptions: checked }))}
              >
                Show Descriptions
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSections.data}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => setVisibleSections((prev) => ({ ...prev, data: checked }))}
              >
                Show Data
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSections.streamData}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => setVisibleSections((prev) => ({ ...prev, streamData: checked }))}
              >
                Show Stream Data
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSections.finalData}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => setVisibleSections((prev) => ({ ...prev, finalData: checked }))}
              >
                Show Final Data
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleSections.error}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) => setVisibleSections((prev) => ({ ...prev, error: checked }))}
              >
                Show Error
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </form>

      <ResponseCard hookResult={hookResult} hasStarted={hasStarted} visibleSections={visibleSections} />
    </div>
  )
}
