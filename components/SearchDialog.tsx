'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { markdownComponents } from '@/components/ui/MarkDown/index'

import { useCompletion } from 'ai/react'
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand } from 'lucide-react'
import remarkGfm from 'remark-gfm'

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')

  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/vector-search',
  })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(true)
      }

      if (e.key === 'Escape') {
        console.log('esc')
        handleModalToggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(query)
    complete(query)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[300px] "
      >
        <Search width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">Search...</span>
        <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{' '}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black">
          <DialogHeader>
            <DialogTitle>StellarGPT: OpenAI powered Semantic Doc Search for Stellar</DialogTitle>
            <DialogDescription>
              Quickly Resolve Bugs and ask other Soroban related questions.
            </DialogDescription>
            <hr />
            <button className="absolute top-0 right-2 p-2" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {query && (
                <div className="flex gap-4">
                  <span className="bg-teal-100 dark:bg-teal-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />{' '}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
                </div>
              )}

              {isLoading && (
                <div className="animate-spin relative flex w-5 h-5 ml-2">
                  <Loader />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                </div>
              )}

              {completion && !error ? (
                <div className="flex items-center gap-4 dark:text-white">
                <span className="bg-teal-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Wand width={18} className="text-white" />
                </span>
                <h3 className="font-semibold">Answer:</h3>
                <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                          linkTarget="_blank"
                          className="prose dark:prose-dark"
                          transformLinkUri={(href) => {
                            const stellarUrl = new URL('https://soroban.stellar.org/docs/')
                            const linkUrl = new URL(href, 'https://soroban.stellar.org/docs/')

                            if (linkUrl.origin === stellarUrl.origin) {
                              return linkUrl.toString()
                            }

                            return href
                          }}
                        >
                  {completion}
                </ReactMarkdown>
                </div>
              ) : null}

              <div className="relative">
                <Input
                  placeholder="Ask a question..."
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
              <div className="text-s p-2 text-gray-500 dark:text-gray-100">
                Or try:{' '}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) => setQuery(' How to invoke a smart contract in Soroban? Explain steps in Korean.')}
                >
                 How to invoke a smart contract in Soroban? Explain steps in Korean.
                </button>
               
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                Ask
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
