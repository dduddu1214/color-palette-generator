// src/components/ColorCard.tsx
'use client';

import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { Color, ColorFormat } from '@/types';
import { copyColorToClipboard } from '@/lib/utils';
import { getColorString } from '@/lib/colorUtils';
import { useToast } from './ui/Toast';
import { cn } from '@/lib/utils';

interface ColorCardProps {
  color: Color;
  onColorUpdate?: (color: Color) => void;
  className?: string;
}

export function ColorCard({ color, onColorUpdate, className }: ColorCardProps) {
  const [currentFormat, setCurrentFormat] = useState<ColorFormat>('hex');
  const [isCopied, setIsCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { addToast } = useToast();

  const handleCopyColor = async () => {
    const success = await copyColorToClipboard(color, currentFormat);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      addToast({
        type: 'success',
        message: `${getColorString(color, currentFormat)} 복사됨!`,
        duration: 2000,
      });
    } else {
      addToast({
        type: 'error',
        message: '복사에 실패했습니다',
        duration: 2000,
      });
    }
  };

  const handleFormatChange = () => {
    const formats: ColorFormat[] = ['hex', 'rgb', 'hsl'];
    const currentIndex = formats.indexOf(currentFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    setCurrentFormat(formats[nextIndex]);
  };

  const getTextColor = (bgColor: string) => {
    // 밝기 계산하여 텍스트 색상 결정
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getTextColor(color.hex);
  const colorString = getColorString(color, currentFormat);

  return (
    <div className={cn('group relative', className)}>
      {/* 메인 색상 영역 */}
      <div
        className="relative w-full h-32 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer color-card"
        style={{ backgroundColor: color.hex }}
        onClick={handleCopyColor}
      >
        {/* 복사 아이콘 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isCopied ? (
            <Check 
              size={20} 
              style={{ color: textColor }}
              className="animate-pulse"
            />
          ) : (
            <Copy 
              size={20} 
              style={{ color: textColor }}
            />
          )}
        </div>

        {/* 색상명 (상단) */}
        {color.name && (
          <div className="absolute top-2 left-2">
            <span 
              className="text-sm font-medium px-2 py-1 rounded bg-black bg-opacity-20 backdrop-blur-sm"
              style={{ color: textColor }}
            >
              {color.name}
            </span>
          </div>
        )}

        {/* 색상 값 (중앙) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFormatChange();
              }}
              className="text-lg font-mono font-bold px-3 py-1 rounded bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
              style={{ color: textColor }}
            >
              {colorString}
            </button>
            <p 
              className="text-xs mt-1 opacity-80"
              style={{ color: textColor }}
            >
              클릭하여 형식 변경
            </p>
          </div>
        </div>

        {/* 세부 정보 토글 */}
        <button
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          style={{ color: textColor }}
        >
          {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* 색상 세부 정보 */}
      {showDetails && (
        <div className="mt-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-sm space-y-2">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">HEX</label>
              <button
                onClick={() => copyColorToClipboard(color, 'hex')}
                className="block w-full text-left font-mono text-sm hover:text-blue-600 transition-colors"
              >
                {color.hex.toUpperCase()}
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">RGB</label>
              <button
                onClick={() => copyColorToClipboard(color, 'rgb')}
                className="block w-full text-left font-mono text-sm hover:text-blue-600 transition-colors"
              >
                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">HSL</label>
              <button
                onClick={() => copyColorToClipboard(color, 'hsl')}
                className="block w-full text-left font-mono text-sm hover:text-blue-600 transition-colors"
              >
                {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 복사 성공 알림 */}
      {isCopied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10">
          복사됨!
        </div>
      )}
    </div>
  );
}