// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Color, ColorFormat } from '@/types';
import { getColorString } from './colorUtils';

/**
 * 클래스명 조합 유틸리티 (Tailwind와 함께 사용)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        return false;
      } finally {
        textArea.remove();
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * 색상을 클립보드에 복사
 */
export async function copyColorToClipboard(color: Color, format: ColorFormat): Promise<boolean> {
  const colorString = getColorString(color, format);
  return await copyToClipboard(colorString);
}

/**
 * UUID 생성 (간단한 버전)
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * 로컬 스토리지에서 데이터 가져오기
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 로컬 스토리지에 데이터 저장
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * 로컬 스토리지에서 데이터 삭제
 */
export function removeFromStorage(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * 숫자를 특정 범위로 제한
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 배열을 섞기
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 날짜를 읽기 쉬운 형식으로 변환
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 파일 다운로드
 */
export function downloadFile(content: string, filename: string, contentType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * CSS 팔레트 내보내기
 */
export function exportPaletteAsCSS(colors: Color[], paletteName: string = 'palette'): string {
  let css = `/* ${paletteName} Color Palette */\n:root {\n`;
  
  colors.forEach((color, index) => {
    const colorName = color.name?.toLowerCase().replace(/\s+/g, '-') || `color-${index + 1}`;
    css += `  --${paletteName}-${colorName}: ${color.hex};\n`;
  });
  
  css += '}\n\n';
  css += `/* Usage example:\n`;
  css += `  background-color: var(--${paletteName}-${colors[0]?.name?.toLowerCase().replace(/\s+/g, '-') || 'color-1'});\n`;
  css += `*/`;
  
  return css;
}

/**
 * JSON 팔레트 내보내기
 */
export function exportPaletteAsJSON(colors: Color[], paletteName: string = 'palette'): string {
  const palette = {
    name: paletteName,
    colors: colors.map((color, index) => ({
      name: color.name || `Color ${index + 1}`,
      hex: color.hex,
      rgb: color.rgb,
      hsl: color.hsl,
    })),
    createdAt: new Date().toISOString(),
  };
  
  return JSON.stringify(palette, null, 2);
}