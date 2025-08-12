// src/components/ColorPicker.tsx
'use client';

import React, { useState } from 'react';
import { Palette, Circle, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  // 인기 색상들
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#6C5CE7', '#A29BFE', '#FD79A8', '#E17055', '#00B894',
  '#0984E3', '#6C5CE7', '#E84393', '#00BCD4', '#8BC34A',
  '#FF9800', '#795548', '#607D8B', '#9C27B0', '#2196F3',
  // 기본 색상들
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
  '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [inputMode, setInputMode] = useState<'preset' | 'picker' | 'text'>('preset');
  const [textValue, setTextValue] = useState(value);

  const handleTextSubmit = () => {
    // HEX 색상 유효성 검사
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(textValue)) {
      onChange(textValue);
    } else {
      // 유효하지 않으면 기본값으로 복원
      setTextValue(value);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      
      {/* 모드 선택 탭 */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setInputMode('preset')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-all',
            inputMode === 'preset' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <Palette size={14} />
          <span className="hidden sm:inline">추천 색상</span>
        </button>
        <button
          onClick={() => setInputMode('picker')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-all',
            inputMode === 'picker' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <Circle size={14} />
          <span className="hidden sm:inline">색상 선택</span>
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-all',
            inputMode === 'text' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <Type size={14} />
          <span className="hidden sm:inline">직접 입력</span>
        </button>
      </div>

      {/* 선택된 모드에 따른 UI */}
      {inputMode === 'preset' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">인기 색상을 선택하세요</p>
          <div className="grid grid-cols-10 gap-2">
            {PRESET_COLORS.map((color, index) => (
              <button
                key={index}
                onClick={() => onChange(color)}
                className={cn(
                  'w-full aspect-square rounded-lg border-2 transition-all hover:scale-110',
                  value === color 
                    ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                    : 'border-gray-200 hover:border-gray-300'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {inputMode === 'picker' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">색상을 직접 선택하세요</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-16 border border-gray-200 rounded-lg cursor-pointer bg-white"
            />
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium text-gray-900">{value.toUpperCase()}</div>
              <div className="text-xs text-gray-500">클릭해서 색상을 변경하세요</div>
            </div>
          </div>
        </div>
      )}

      {inputMode === 'text' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">HEX 색상 코드를 입력하세요 (예: #FF6B6B)</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
              placeholder="#FF6B6B"
              className="flex-1 input-modern font-mono"
              maxLength={7}
            />
            <div 
              className="w-12 h-10 rounded-lg border border-gray-200"
              style={{ backgroundColor: textValue }}
            />
          </div>
        </div>
      )}
    </div>
  );
}