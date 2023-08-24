import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import './globals.css'
import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

const clerk_pub_key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!

export const metadata: Metadata = {
  title: 'Restaurant Server',
  description: 'Restaurant Server',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={clerk_pub_key}>
      <html lang="en">
        <body >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem> {/* app-index.js:32 Warning: Extra attributes from the server */}
            <ModalProvider />

            <ToasterProvider />
            
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}