import { Metadata } from 'next'
import { Sen as FontSans } from 'next/font/google'
import { cn } from '@/utils/cn'

import '@/styles/globals.css'

import { SEO } from '@/constants/seo'

import { TailwindIndicator } from '@/components/tailwind-indicator'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

type RootLayoutProps = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: { absolute: SEO.title, template: `%s // ${SEO.title}` },
  applicationName: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  themeColor: '#0A0A0A',
  openGraph: {
    locale: 'en',
    title: SEO.title,
    description: SEO.description,
    url: SEO.url,
    type: 'website',
    images: [
      {
        url: '/images/thumb.png',
        width: 1200,
        height: 630,
        alt: SEO.description,
      },
    ],
    siteName: SEO.title,
  },
  twitter: {
    site: SEO.twitter,
  },
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          'flex h-full min-h-screen flex-col',
          'bg-neutral-900',
          'text-neutral-50',
          fontSans.variable,
        )}
      >
        <main className="flex flex-1 flex-col">{children}</main>

        <TailwindIndicator />
      </body>
    </html>
  )
}

export default RootLayout
