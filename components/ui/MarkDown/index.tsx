import * as React from 'react'
import { CodeBlock } from '@/components/ui/CodeBlock/CodeBlock'
import Image from 'next/image'

export const markdownComponents = {
  mono: (props: any) => <code className="text-sm">{props.children}</code>,
  code: (props: any) => <CodeBlock {...props} />,
  img: (props: any) => {
    return (
      <span className={['next-image--dynamic-fill'].join(' ')}>
        <Image {...props} className={['rounded-md border'].join(' ')} layout="fill" />
      </span>
    )
  },
  // Added custom renderer for links
  a: (props: any) => {
    return (
      <a href={props.href} className="text-teal-500 hover:underline" target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    )
  }
}
