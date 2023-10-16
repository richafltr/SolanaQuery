import { createContext } from 'react'
import { SizeVariantProps } from './commonCva'

type ContextValue = { contextSize?: SizeVariantProps; className?: string }

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const IconContext = createContext<ContextValue>({
  contextSize: 'small',
  className: '',
})
