'use client'

import { ModeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GithubIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTellStory } from '../../baml_client/react/hooks'
import TestClient from '../components/hook-example'
import { AVAILABLE_HOOKS, type HookType } from '../components/hook-example/hooks'

export function Component() {
  const tellStory = useTellStory()

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <header className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-2'>
            {/* <span className='text-lg font-mono'>+</span> */}
            {/* <span className='text-lg font-bold'>BAML</span> */}
          </div>
          {/* <div className='flex items-center gap-4'>
            <Button asChild variant='outline'>
              <a href='https://docs.boundaryml.com' target='_blank' rel='noopener noreferrer'>
                Documentation
              </a>
            </Button>
            <Button asChild>
              <a href='https://docs.boundaryml.com/docs/examples' target='_blank' rel='noopener noreferrer'>
                View Examples
              </a>
            </Button>
            <Button variant='outline' size='icon' asChild>
              <a href='https://github.com/boundaryml/baml' target='_blank' rel='noopener noreferrer'>
                <GithubIcon className='h-4 w-4' />
              </a>
            </Button>
            <ModeToggle />
          </div> */}
        </header>

        <main className='space-y-8'>
          <div className='text-center space-y-4 justify-center items-center'>
            <h1 className='text-3xl font-bold tracking-tight flex gap-2 items-center justify-center'>
              BAML <span className='text-lg font-mono px-2 text-muted-foreground'>+</span>
              <Image className='dark:invert' src='/next.svg' alt='Next.js logo' width={100} height={20} priority />{' '}
              {/* Integration */}
            </h1>
            <p className='text-lg text-muted-foreground'>Select an example below to get started.</p>
            <div className='w-full max-w-xs mx-auto'>
              <Select value={selectedHook} onValueChange={(value: HookType) => setSelectedHook(value)}>
                <SelectTrigger className='h-10 flex justify-between items-center text-left'>
                  <SelectValue placeholder='Select an example'>{AVAILABLE_HOOKS[selectedHook].name}</SelectValue>
                </SelectTrigger>
                <SelectContent className='p-0'>
                  <div className='p-2 space-y-2'>
                    {(Object.entries(AVAILABLE_HOOKS) as [HookType, (typeof AVAILABLE_HOOKS)[HookType]][]).map(
                      ([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className='font-bold'>{config.name}</div>
                          <p className='text-sm text-muted-foreground data-[state=closed]:hidden data-[state=open]:block'>
                            {config.description}
                          </p>
                        </SelectItem>
                      ),
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TestClient hookType={selectedHook} />
        </main>

        <footer className='mt-16 text-center'>
          <p className='text-sm text-muted-foreground'>
            Built with{' '}
            <a
              href='https://nextjs.org'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium underline underline-offset-4'
            >
              Next.js
            </a>{' '}
            and{' '}
            <a
              href='https://boundaryml.com'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium underline underline-offset-4'
            >
              BAML
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
