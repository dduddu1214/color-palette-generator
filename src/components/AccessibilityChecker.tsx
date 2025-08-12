// src/components/AccessibilityChecker.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Eye, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Color } from '@/types';
import { analyzePaletteAccessibility, checkColorBlindFriendly, ColorAccessibility } from '@/lib/accessibilityUtils';
import { Button } from './ui/Button';

interface AccessibilityCheckerProps {
  colors: Color[];
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityChecker({ colors, isOpen, onClose }: AccessibilityCheckerProps) {
  const [selectedTab, setSelectedTab] = useState<'contrast' | 'colorblind'>('contrast');
  
  const paletteAccessibility = useMemo(() => {
    if (colors.length < 2) return null;
    return analyzePaletteAccessibility(colors);
  }, [colors]);
  
  const colorBlindAnalysis = useMemo(() => {
    if (colors.length < 2) return null;
    return checkColorBlindFriendly(colors);
  }, [colors]);
  
  if (!isOpen || !paletteAccessibility || !colorBlindAnalysis) return null;
  
  const getGradeColor = (grade: ColorAccessibility['grade']) => {
    switch (grade) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'poor': return 'text-yellow-600 bg-yellow-50';
      case 'fail': return 'text-red-600 bg-red-50';
    }
  };
  
  const getGradeIcon = (grade: ColorAccessibility['grade']) => {
    switch (grade) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'poor':
      case 'fail':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              색상 적합성 검사
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              웹 접근성 기준에 맞는지 확인하고, 색맹 사용자도 구분할 수 있는지 검사합니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('contrast')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'contrast'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 색상 대비 검사
          </button>
          <button
            onClick={() => setSelectedTab('colorblind')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'colorblind'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            👁️ 색맹 친화성 검사
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {selectedTab === 'contrast' && (
            <div className="space-y-6">
              {/* 최고 조합 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  최고의 접근성 조합
                </h3>
                <div className="space-y-3">
                  {paletteAccessibility.bestCombinations.slice(0, 3).map((combo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded border border-gray-200"
                            style={{ backgroundColor: combo.foreground.hex }}
                            title={`전경색: ${combo.foreground.hex}`}
                          />
                          <div
                            className="w-8 h-8 rounded border border-gray-200 relative"
                            style={{ backgroundColor: combo.background.hex }}
                            title={`배경색: ${combo.background.hex}`}
                          >
                            <div
                              className="absolute inset-1 rounded text-xs flex items-center justify-center font-bold"
                              style={{ 
                                backgroundColor: combo.foreground.hex,
                                color: combo.background.hex 
                              }}
                            >
                              A
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            대비율: {combo.accessibility.contrastRatio.toFixed(2)}:1
                          </div>
                          <div className="text-xs text-gray-600">
                            {combo.accessibility.recommendation}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        getGradeColor(combo.accessibility.grade)
                      }`}>
                        {getGradeIcon(combo.accessibility.grade)}
                        {combo.accessibility.grade.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 개선 필요 조합 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  개선이 필요한 조합
                </h3>
                <div className="space-y-3">
                  {paletteAccessibility.worstCombinations.slice(0, 3).map((combo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded border border-gray-200"
                            style={{ backgroundColor: combo.foreground.hex }}
                            title={`전경색: ${combo.foreground.hex}`}
                          />
                          <div
                            className="w-8 h-8 rounded border border-gray-200 relative"
                            style={{ backgroundColor: combo.background.hex }}
                            title={`배경색: ${combo.background.hex}`}
                          >
                            <div
                              className="absolute inset-1 rounded text-xs flex items-center justify-center font-bold"
                              style={{ 
                                backgroundColor: combo.foreground.hex,
                                color: combo.background.hex 
                              }}
                            >
                              A
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            대비율: {combo.accessibility.contrastRatio.toFixed(2)}:1
                          </div>
                          <div className="text-xs text-gray-600">
                            {combo.accessibility.recommendation}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        getGradeColor(combo.accessibility.grade)
                      }`}>
                        {getGradeIcon(combo.accessibility.grade)}
                        {combo.accessibility.grade.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WCAG 기준 설명 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">WCAG 접근성 기준</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>• <strong>AAA (7:1)</strong>: 최고 수준의 접근성</div>
                  <div>• <strong>AA (4.5:1)</strong>: 일반 텍스트 권장 기준</div>
                  <div>• <strong>AA Large (3:1)</strong>: 대형 텍스트 최소 기준</div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'colorblind' && (
            <div className="space-y-6">
              {/* 색맹 친화성 상태 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">색맹 친화성 분석</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className={`h-5 w-5 ${colorBlindAnalysis.protanopia ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="font-medium">적색맹 (Protanopia)</span>
                    </div>
                    <div className={`text-sm ${colorBlindAnalysis.protanopia ? 'text-green-600' : 'text-red-600'}`}>
                      {colorBlindAnalysis.protanopia ? '친화적' : '개선 필요'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className={`h-5 w-5 ${colorBlindAnalysis.deuteranopia ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="font-medium">녹색맹 (Deuteranopia)</span>
                    </div>
                    <div className={`text-sm ${colorBlindAnalysis.deuteranopia ? 'text-green-600' : 'text-red-600'}`}>
                      {colorBlindAnalysis.deuteranopia ? '친화적' : '개선 필요'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className={`h-5 w-5 ${colorBlindAnalysis.tritanopia ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="font-medium">청색맹 (Tritanopia)</span>
                    </div>
                    <div className={`text-sm ${colorBlindAnalysis.tritanopia ? 'text-green-600' : 'text-red-600'}`}>
                      {colorBlindAnalysis.tritanopia ? '친화적' : '개선 필요'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 권장사항 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">개선 권장사항</h4>
                <div className="space-y-2">
                  {colorBlindAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 색맹 시뮬레이션 (간단한 설명) */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2">💡 색맹 친화적 팔레트 만들기 팁</h4>
                <div className="text-sm text-amber-800 space-y-1">
                  <div>• 색상뿐만 아니라 밝기나 패턴으로도 구분할 수 있게 하세요</div>
                  <div>• 빨강과 녹색을 함께 사용할 때는 충분한 밝기 차이를 두세요</div>
                  <div>• 파랑과 노랑 조합은 대부분의 색맹에게 구분이 용이합니다</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
}