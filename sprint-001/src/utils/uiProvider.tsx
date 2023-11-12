// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemeProvider, ThemeProvider} from 'next-themes'

export function UIProviders({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ThemeProvider attribute='class' defaultTheme='dark'>
        {children}
      </ThemeProvider>
    </NextUIProvider>
  )
}