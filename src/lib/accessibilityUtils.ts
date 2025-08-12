// src/lib/accessibilityUtils.ts
import { Color } from '@/types';
import { hexToRgb } from './colorUtils';

/**
 * 상대 휘도 계산 (WCAG 기준)
 */
function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  
  // sRGB 색상 공간을 선형 RGB로 변환
  const toLinear = (value: number): number => {
    const normalized = value / 255;
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);
  
  // ITU-R BT.709 가중치 적용
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * 두 색상 간의 대비율 계산 (WCAG 기준)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (lightest + 0.05) / (darkest + 0.05);
}

/**
 * WCAG 접근성 등급 확인
 */
export interface AccessibilityLevel {
  aa: boolean;      // AA 등급 (4.5:1)
  aaa: boolean;     // AAA 등급 (7:1)
  aaLarge: boolean; // AA 대형 텍스트 (3:1)
  aaaLarge: boolean; // AAA 대형 텍스트 (4.5:1)
}

export function getAccessibilityLevel(contrastRatio: number): AccessibilityLevel {
  return {
    aa: contrastRatio >= 4.5,
    aaa: contrastRatio >= 7,
    aaLarge: contrastRatio >= 3,
    aaaLarge: contrastRatio >= 4.5,
  };
}

/**
 * 색상과 배경의 접근성 분석
 */
export interface ColorAccessibility {
  contrastRatio: number;
  levels: AccessibilityLevel;
  recommendation: string;
  grade: 'excellent' | 'good' | 'poor' | 'fail';
}

export function analyzeColorAccessibility(foreground: string, background: string): ColorAccessibility {
  const contrastRatio = getContrastRatio(foreground, background);
  const levels = getAccessibilityLevel(contrastRatio);
  
  let recommendation: string;
  let grade: ColorAccessibility['grade'];
  
  if (levels.aaa) {
    recommendation = '모든 상황에서 사용 가능한 최고의 접근성';
    grade = 'excellent';
  } else if (levels.aa) {
    recommendation = '일반 텍스트에 적합한 좋은 접근성';
    grade = 'good';
  } else if (levels.aaLarge) {
    recommendation = '대형 텍스트에만 사용 권장';
    grade = 'poor';
  } else {
    recommendation = '접근성 기준에 미달, 사용 지양';
    grade = 'fail';
  }
  
  return {
    contrastRatio,
    levels,
    recommendation,
    grade,
  };
}

/**
 * 팔레트 내 색상들의 접근성 조합 분석
 */
export interface PaletteAccessibility {
  combinations: Array<{
    foreground: Color;
    background: Color;
    accessibility: ColorAccessibility;
  }>;
  bestCombinations: Array<{
    foreground: Color;
    background: Color;
    accessibility: ColorAccessibility;
  }>;
  worstCombinations: Array<{
    foreground: Color;
    background: Color;
    accessibility: ColorAccessibility;
  }>;
}

export function analyzePaletteAccessibility(colors: Color[]): PaletteAccessibility {
  const combinations: PaletteAccessibility['combinations'] = [];
  
  // 모든 색상 조합에 대해 접근성 분석
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors.length; j++) {
      if (i !== j) {
        const foreground = colors[i];
        const background = colors[j];
        const accessibility = analyzeColorAccessibility(foreground.hex, background.hex);
        
        combinations.push({
          foreground,
          background,
          accessibility,
        });
      }
    }
  }
  
  // 정렬
  const sortedByContrast = [...combinations].sort((a, b) => 
    b.accessibility.contrastRatio - a.accessibility.contrastRatio
  );
  
  return {
    combinations,
    bestCombinations: sortedByContrast.slice(0, 5),
    worstCombinations: sortedByContrast.slice(-5),
  };
}

/**
 * 색상이 색맹 친화적인지 확인
 */
export function checkColorBlindFriendly(colors: Color[]): {
  protanopia: boolean;     // 적색맹
  deuteranopia: boolean;   // 녹색맹
  tritanopia: boolean;     // 청색맹
  recommendations: string[];
} {
  // 간단한 색맹 친화성 체크 (실제로는 더 복잡한 알고리즘 필요)
  const hasRedGreenIssues = colors.some((color, index) => {
    return colors.some((otherColor, otherIndex) => {
      if (index === otherIndex) return false;
      
      // 빨강-녹색 구분 어려운 조합 체크
      const redDiff = Math.abs(color.rgb.r - otherColor.rgb.r);
      const greenDiff = Math.abs(color.rgb.g - otherColor.rgb.g);
      const blueDiff = Math.abs(color.rgb.b - otherColor.rgb.b);
      
      return redDiff < 50 && greenDiff < 50 && blueDiff > 100;
    });
  });
  
  const hasBlueYellowIssues = colors.some((color, index) => {
    return colors.some((otherColor, otherIndex) => {
      if (index === otherIndex) return false;
      
      // 파랑-노랑 구분 어려운 조합 체크
      const blueDiff = Math.abs(color.rgb.b - otherColor.rgb.b);
      const yellowValue = (color.rgb.r + color.rgb.g) / 2;
      const otherYellowValue = (otherColor.rgb.r + otherColor.rgb.g) / 2;
      const yellowDiff = Math.abs(yellowValue - otherYellowValue);
      
      return blueDiff < 50 && yellowDiff < 50;
    });
  });
  
  const recommendations: string[] = [];
  
  if (hasRedGreenIssues) {
    recommendations.push('빨강-녹색 구분이 어려울 수 있습니다. 밝기 차이를 늘려보세요.');
  }
  
  if (hasBlueYellowIssues) {
    recommendations.push('파랑-노랑 구분이 어려울 수 있습니다. 채도 차이를 늘려보세요.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('색맹 친화적인 팔레트입니다!');
  }
  
  return {
    protanopia: !hasRedGreenIssues,
    deuteranopia: !hasRedGreenIssues,
    tritanopia: !hasBlueYellowIssues,
    recommendations,
  };
}