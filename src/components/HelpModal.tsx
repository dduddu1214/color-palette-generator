// src/components/HelpModal.tsx
'use client';

import React from 'react';
import { X, Keyboard, Mouse, Download, Save, Shuffle } from 'lucide-react';
import { Button } from './ui/Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', description: '새 팔레트 생성', icon: Shuffle },
    { key: 'Ctrl + S', description: '팔레트 저장', icon: Save },
    { key: 'Ctrl + E', description: 'CSS로 내보내기', icon: Download },
    { key: 'Ctrl + J', description: 'JSON으로 내보내기', icon: Download },
    { key: 'Shift + ?', description: '이 도움말 표시', icon: Keyboard },
  ];

  const mouseActions = [
    { action: '색상 카드 클릭', description: '색상 코드 복사' },
    { action: '색상 코드 클릭', description: '색상 형식 변경 (HEX/RGB/HSL)' },
    { action: '눈 아이콘 클릭', description: '상세 정보 표시/숨기기' },
    { action: '저장된 팔레트 클릭', description: '팔레트 불러오기' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            사용법 및 단축키
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 키보드 단축키 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              키보드 단축키
            </h3>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{shortcut.description}</span>
                    </div>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 마우스 액션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Mouse className="h-5 w-5" />
              마우스 액션
            </h3>
            <div className="space-y-3">
              {mouseActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">{action.description}</span>
                  <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded border">
                    {action.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 팁 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 사용 팁</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 조화로운 색상을 원한다면 &lsquo;인접색&rsquo; 또는 &lsquo;보색&rsquo; 모드를 사용해보세요</li>
              <li>• 색상 카드를 클릭하면 자동으로 클립보드에 복사됩니다</li>
              <li>• 저장된 팔레트는 브라우저에 자동으로 저장됩니다</li>
              <li>• CSS 내보내기로 웹 프로젝트에 바로 사용할 수 있습니다</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
}