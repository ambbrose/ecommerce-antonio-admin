import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs';
import { ModalProvider } from '@/providers/modal-provider';
import ToastProvider from '@/providers/toast-provider';
import { ThemeProvider } from '@/providers/theme-provider';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ModalProvider />
            {children}
            <ToastProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}