// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Color Palette Generator - 색상 팔레트 생성기'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* 메인 컨테이너 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '60px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* 아이콘과 제목 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '64px', marginRight: '20px' }}>🎨</span>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: 0,
              }}
            >
              Color Palette Generator
            </h1>
          </div>

          {/* 설명 */}
          <p
            style={{
              fontSize: '24px',
              color: '#64748b',
              textAlign: 'center',
              margin: '0 0 40px 0',
              lineHeight: 1.4,
            }}
          >
            디자이너와 개발자를 위한 색상 팔레트 생성 도구
          </p>

          {/* 색상 팔레트 미리보기 */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '30px',
            }}
          >
            {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#6C5CE7'].map(
              (color, index) => (
                <div
                  key={index}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: color,
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
              )
            )}
          </div>

          {/* 특징 */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '16px',
              color: '#475569',
            }}
          >
            <span>🌈 조화로운 색상</span>
            <span>📋 원클릭 복사</span>
            <span>💾 CSS/JSON 내보내기</span>
            <span>♿ 접근성 체크</span>
          </div>

          {/* 제작자 */}
          <div
            style={{
              marginTop: '20px',
              fontSize: '14px',
              color: '#94a3b8',
            }}
          >
            Made with ❤️ by devdduddu
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}