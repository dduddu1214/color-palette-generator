// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Color Palette Generator',
  description: '아름다운 색상 팔레트를 생성하고 관리하세요',
  keywords: ['color', 'palette', 'generator', 'design', 'hex', 'rgb', 'hsl'],
  authors: [{ name: 'devdduddu' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                🎨 Color Palette Generator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                아름다운 색상 조합을 만들고 공유하세요
              </p>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-gray-500">
                Made with ❤️ by devdduddu for designers and developers
              </p>
            </div>
          </footer>
        </div>
        </ToastProvider>
      </body>
    </html>
  )
}