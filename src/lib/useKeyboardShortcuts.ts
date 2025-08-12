// src/lib/useKeyboardShortcuts.ts
'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 단축키 비활성화
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
        const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
        const altMatch = !!shortcut.altKey === event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// 기본 단축키 설정
export const createPaletteShortcuts = (callbacks: {
  generateNew: () => void;
  save: () => void;
  exportCSS: () => void;
  exportJSON: () => void;
  toggleHelp: () => void;
}): KeyboardShortcut[] => [
  {
    key: ' ', // 스페이스바
    callback: callbacks.generateNew,
    description: '새 팔레트 생성',
  },
  {
    key: 's',
    ctrlKey: true,
    callback: callbacks.save,
    description: '팔레트 저장',
  },
  {
    key: 'e',
    ctrlKey: true,
    callback: callbacks.exportCSS,
    description: 'CSS로 내보내기',
  },
  {
    key: 'j',
    ctrlKey: true,
    callback: callbacks.exportJSON,
    description: 'JSON으로 내보내기',
  },
  {
    key: '?',
    shiftKey: true,
    callback: callbacks.toggleHelp,
    description: '도움말 표시',
  },
];