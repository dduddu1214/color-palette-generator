// src/components/ColorCard.tsx
'use client';

import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { Color, ColorFormat } from '@/types';
import { getColorString, copyColorToClipboard } from '@/lib/utils';
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
    try {
      // 밝기 계산하여 텍스트 색상 결정
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return brightness > 128 ? '#000000' : '#FFFFFF';
    } catch (error) {
      return '#000000'; // 기본값
    }
  };

  const textColor = getTextColor(color.hex);
  const colorString = getColorString(color, currentFormat);

  // 16진수 색상에 알파 값 추가하는 헬퍼 함수
  const addAlpha = (hexColor: string, alpha: string) => {
    return `${hexColor}${alpha}`;
  };

  return (
    <div className={cn('group relative fade-in', className)}>
      {/* 메인 색상 영역 */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-square color-card"
        style={{ backgroundColor: color.hex }}
        onClick={handleCopyColor}
      >
        {/* 복사 상태 오버레이 */}
        {isCopied && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm rounded-xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <Check size={20} className="text-green-600" />
            </div>
          </div>
        )}

        {/* 복사 아이콘 */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div 
            className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            style={{ 
              backgroundColor: textColor === '#000000' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
            }}
          >
            <Copy 
              size={16} 
              style={{ color: textColor }}
              className="drop-shadow-sm"
            />
          </div>
        </div>

        {/* 색상명 (상단) */}
        {color.name && (
          <div className="absolute top-3 left-3">
            <span 
              className="text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm border"
              style={{ 
                backgroundColor: textColor === '#000000' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                color: textColor,
                borderColor: textColor === '#000000' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
              }}
            >
              {color.name}
            </span>
          </div>
        )}

        {/* 색상 값 (중앙) */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFormatChange();
              }}
              className="group/btn"
            >
              <div 
                className="font-mono font-semibold px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 group-hover/btn:scale-105 shadow-sm border"
                style={{ 
                  backgroundColor: textColor === '#000000' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                  color: textColor,
                  borderColor: textColor === '#000000' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  fontSize: colorString.length > 12 ? '0.75rem' : '0.875rem'
                }}
              >
                {colorString}
              </div>
            </button>
            <p 
              className="text-xs mt-2 opacity-0 group-hover:opacity-80 transition-all duration-300 font-medium"
              style={{ color: textColor }}
            >
              클릭하여 형식 변경
            </p>
          </div>
        </div>

        {/* 세부 정보 토글 */}
        <button
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
        >
          <div 
            className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            style={{ 
              backgroundColor: textColor === '#000000' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
            }}
          >
            {showDetails ? 
              <EyeOff size={14} style={{ color: textColor }} /> : 
              <Eye size={14} style={{ color: textColor }} />
            }
          </div>
        </button>
      </div>

      {/* 색상 세부 정보 */}
      {showDetails && (
        <div className="mt-3 modern-card p-4 slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">HEX</label>
              <button
                onClick={() => copyColorToClipboard(color, 'hex')}
                className="block w-full text-left font-mono text-sm p-2 rounded-lg bg-gray-50 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 border border-transparent hover:border-blue-200"
              >
                {color.hex.toUpperCase()}
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RGB</label>
              <button
                onClick={() => copyColorToClipboard(color, 'rgb')}
                className="block w-full text-left font-mono text-sm p-2 rounded-lg bg-gray-50 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 border border-transparent hover:border-blue-200"
              >
                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">HSL</label>
              <button
                onClick={() => copyColorToClipboard(color, 'hsl')}
                className="block w-full text-left font-mono text-sm p-2 rounded-lg bg-gray-50 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 border border-transparent hover:border-blue-200"
              >
                {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}