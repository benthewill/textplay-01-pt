// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemeProvider} from 'next-themes'

export function UIProviders({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
        {children}
    </NextUIProvider>
  )
}