// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Color Palette Generator - 아름다운 색상 팔레트 생성기',
  description: '🎨 디자이너와 개발자를 위한 색상 팔레트 생성 도구입니다. 랜덤, 조화로운 색상 조합을 쉽게 만들고, HEX/RGB/HSL 형식으로 복사하며, CSS/JSON으로 내보낼 수 있습니다.',
  keywords: ['color', 'palette', 'generator', 'design', 'hex', 'rgb', 'hsl', '색상', '팔레트', '디자인'],
  authors: [{ name: 'devdduddu', url: 'https://github.com/devdduddu' }],
  creator: 'devdduddu',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  
  // Open Graph (카카오톡, 페이스북 등)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://color-palette-generator-one-theta.vercel.app',
    siteName: 'Color Palette Generator',
    title: '🎨 Color Palette Generator - 색상 팔레트 생성기',
    description: '디자이너와 개발자를 위한 완벽한 색상 팔레트 생성 도구. 조화로운 색상 조합을 쉽게 만들고 바로 사용하세요!',
    images: [
      {
        url: '/og-image.png', // 나중에 추가할 이미지
        width: 1200,
        height: 630,
        alt: 'Color Palette Generator - 색상 팔레트 생성기',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@devdduddu',
    creator: '@devdduddu',
    title: '🎨 Color Palette Generator',
    description: '디자이너와 개발자를 위한 색상 팔레트 생성 도구',
    images: ['/og-image.png'],
  },
  
  // 추가 메타데이터
  category: 'Design Tools',
  classification: 'Design, Development, Tools',
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
                Made with ❤️ for designers and developers
              </p>
            </div>
          </footer>
        </div>
        </ToastProvider>
      </body>
    </html>
  )
}