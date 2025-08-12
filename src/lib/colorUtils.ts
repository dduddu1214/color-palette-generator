// lib/colorUtils.ts
import { Color } from '@/types';

/**
 * HEX 색상을 RGB로 변환
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid HEX color');
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * RGB를 HEX로 변환
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * RGB를 HSL로 변환
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number = 0;
  let s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * HSL을 RGB로 변환
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * 랜덤 HEX 색상 생성
 */
export function generateRandomHex(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * 완전한 Color 객체 생성
 */
export function createColor(hex: string): Color {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  return {
    hex,
    rgb,
    hsl,
    name: getColorName(hex),
  };
}

/**
 * 조화로운 색상 팔레트 생성
 */
export function generateHarmoniousPalette(baseColor: string, type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' = 'analogous', count: number = 5): Color[] {
  const baseRgb = hexToRgb(baseColor);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  const colors: Color[] = [];

  switch (type) {
    case 'monochromatic':
      // 같은 색조, 다른 명도와 채도
      for (let i = 0; i < count; i++) {
        const lightness = Math.max(10, Math.min(90, baseHsl.l + (i - Math.floor(count / 2)) * 20));
        const saturation = Math.max(10, Math.min(100, baseHsl.s + (i - Math.floor(count / 2)) * 15));
        const rgb = hslToRgb(baseHsl.h, saturation, lightness);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        colors.push(createColor(hex));
      }
      break;

    case 'analogous':
      // 인접한 색조 (±30도)
      for (let i = 0; i < count; i++) {
        const hue = (baseHsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360;
        const rgb = hslToRgb(hue, baseHsl.s, baseHsl.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        colors.push(createColor(hex));
      }
      break;

    case 'complementary':
      // 보색 관계 (180도 차이)
      colors.push(createColor(baseColor));
      const complementaryHue = (baseHsl.h + 180) % 360;
      const complementaryRgb = hslToRgb(complementaryHue, baseHsl.s, baseHsl.l);
      colors.push(createColor(rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b)));
      
      // 나머지는 이 두 색상의 변형
      for (let i = 2; i < count; i++) {
        const useBase = i % 2 === 0;
        const hue = useBase ? baseHsl.h : complementaryHue;
        const lightness = Math.max(20, Math.min(80, baseHsl.l + (Math.random() - 0.5) * 40));
        const rgb = hslToRgb(hue, baseHsl.s, lightness);
        colors.push(createColor(rgbToHex(rgb.r, rgb.g, rgb.b)));
      }
      break;

    case 'triadic':
      // 삼색조 (120도씩 차이)
      for (let i = 0; i < Math.min(count, 3); i++) {
        const hue = (baseHsl.h + i * 120) % 360;
        const rgb = hslToRgb(hue, baseHsl.s, baseHsl.l);
        colors.push(createColor(rgbToHex(rgb.r, rgb.g, rgb.b)));
      }
      
      // 나머지는 랜덤 변형
      for (let i = 3; i < count; i++) {
        const randomHue = Math.floor(Math.random() * 360);
        const rgb = hslToRgb(randomHue, baseHsl.s, baseHsl.l);
        colors.push(createColor(rgbToHex(rgb.r, rgb.g, rgb.b)));
      }
      break;
  }

  return colors;
}

/**
 * 완전 랜덤 팔레트 생성
 */
export function generateRandomPalette(count: number = 5): Color[] {
  const colors: Color[] = [];
  for (let i = 0; i < count; i++) {
    const hex = generateRandomHex();
    colors.push(createColor(hex));
  }
  return colors;
}

/**
 * 색상 이름 추정 (간단한 버전)
 */
function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // 기본 색상 이름 매핑 (간단한 버전)
  const colorNames = [
    { name: 'Red', hue: 0, range: 30 },
    { name: 'Orange', hue: 30, range: 30 },
    { name: 'Yellow', hue: 60, range: 30 },
    { name: 'Green', hue: 120, range: 60 },
    { name: 'Cyan', hue: 180, range: 30 },
    { name: 'Blue', hue: 240, range: 60 },
    { name: 'Purple', hue: 300, range: 30 },
    { name: 'Pink', hue: 330, range: 30 },
  ];

  if (hsl.s < 10) return hsl.l > 90 ? 'White' : hsl.l < 10 ? 'Black' : 'Gray';
  
  for (const color of colorNames) {
    if (Math.abs(hsl.h - color.hue) <= color.range / 2 || 
        Math.abs(hsl.h - color.hue + 360) <= color.range / 2 ||
        Math.abs(hsl.h - color.hue - 360) <= color.range / 2) {
      return color.name;
    }
  }
  
  return 'Unknown';
}

/**
 * 색상 형식별 문자열 변환
 */
export function getColorString(color: Color, format: 'hex' | 'rgb' | 'hsl'): string {
  switch (format) {
    case 'hex':
      return color.hex.toUpperCase();
    case 'rgb':
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case 'hsl':
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    default:
      return color.hex;
  }
}