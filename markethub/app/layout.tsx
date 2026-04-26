import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import BlobBackground from '@/components/ui/BlobBackground'

// next/font automatically self-hosts, subsets, and eliminates layout shift
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MarketHub — Multi-Vendor Marketplace',
    template: '%s | MarketHub',
  },
  description:
    'Discover thousands of products from trusted independent vendors. Shop electronics, fitness gear, accessories, clothing, and more on MarketHub.',
  keywords: ['marketplace', 'multi-vendor', 'shop', 'products', 'ecommerce'],
  authors: [{ name: 'MarketHub' }],
  openGraph: {
    title: 'MarketHub — Multi-Vendor Marketplace',
    description: 'Discover products from the best independent vendors.',
    type: 'website',
  },
}

import ToastContainer from '@/components/ui/Toast'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import ChatWidget from '@/components/chat/ChatWidget'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ThemeProvider>
          <SessionProvider>
            <BlobBackground />
            <ToastContainer />
            <ChatWidget />
            <div className="page-wrapper" style={{ position: 'relative', zIndex: 1 }}>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

