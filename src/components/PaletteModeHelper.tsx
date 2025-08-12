// src/components/PaletteModeHelper.tsx
'use client';

import React from 'react';
import { Info, X } from 'lucide-react';
import { Button } from './ui/Button';

type PaletteMode = 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic';

interface PaletteModeHelperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaletteModeHelper({ isOpen, onClose }: PaletteModeHelperProps) {
  if (!isOpen) return null;

  const modeExamples = [
    {
      mode: 'random' as PaletteMode,
      title: '🎲 완전 랜덤',
      description: '예측할 수 없는 놀라운 색상 조합',
      useCases: ['창의적 영감이 필요할 때', '실험적인 디자인', '아이디어 브레인스토밍'],
      examples: ['아트 프로젝트', '창작 활동', '새로운 시도'],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
    },
    {
      mode: 'monochromatic' as PaletteMode,
      title: '🌊 같은 색 톤',
      description: '하나의 색상으로 만든 차분한 팔레트',
      useCases: ['미니멀한 디자인', '전문적인 문서', '차분한 분위기'],
      examples: ['기업 브랜딩', '포트폴리오', '프레젠테이션'],
      colors: ['#1B365D', '#2E5984', '#4A7BA7', '#7396B7', '#9BB1C8']
    },
    {
      mode: 'analogous' as PaletteMode,
      title: '🌈 자연스러운 조화',
      description: '자연에서 볼 수 있는 편안한 색상 조합',
      useCases: ['자연스러운 디자인', '편안한 느낌', '조화로운 분위기'],
      examples: ['웹사이트 디자인', '인테리어', '일러스트'],
      colors: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569', '#F8B500']
    },
    {
      mode: 'complementary' as PaletteMode,
      title: '⚡ 강렬한 대비',
      description: '서로 돋보이게 하는 역동적인 조합',
      useCases: ['주목을 끌고 싶을 때', '강렬한 인상', '중요한 요소 강조'],
      examples: ['광고 디자인', '로고', '강조 포인트'],
      colors: ['#FF6B6B', '#6BCF7F', '#4A90E2', '#F39C12', '#9B59B6']
    },
    {
      mode: 'triadic' as PaletteMode,
      title: '✨ 균형잡힌 조화',
      description: '세련되고 안정감 있는 색상 조합',
      useCases: ['균형잡힌 디자인', '세련된 느낌', '프로페셜널한 분위기'],
      examples: ['UI/UX 디자인', '브랜드 컬러', '제품 디자인'],
      colors: ['#E74C3C', '#3498DB', '#F1C40F', '#2ECC71', '#9B59B6']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Info className="h-5 w-5" />
            팔레트 스타일 가이드
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {modeExamples.map((example) => (
            <div key={example.mode} className="modern-card p-5">
              <div className="flex items-start gap-4">
                {/* 색상 미리보기 */}
                <div className="flex gap-1 flex-shrink-0">
                  {example.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-12 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* 설명 */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {example.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {example.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">🎯 이런 때 사용하세요</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {example.useCases.map((useCase, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">💡 활용 예시</h4>
                      <div className="flex flex-wrap gap-1">
                        {example.examples.map((ex, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 팁 섹션 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 팔레트 선택 팁</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>처음 사용한다면</strong> → 🌈 자연스러운 조화부터 시작해보세요</li>
              <li>• <strong>브랜딩 작업</strong> → 🌊 같은 색 톤이나 ✨ 균형잡힌 조화 추천</li>
              <li>• <strong>눈에 띄는 디자인</strong> → ⚡ 강렬한 대비를 활용해보세요</li>
              <li>• <strong>영감이 필요할 때</strong> → 🎲 완전 랜덤으로 새로운 아이디어를 얻어보세요</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>시작하기</Button>
        </div>
      </div>
    </div>
  );
}