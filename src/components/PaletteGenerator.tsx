// src/components/PaletteGenerator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Download, Save, Palette, RefreshCw, HelpCircle, Shield } from 'lucide-react';
import { Color, Palette as PaletteType } from '@/types';
import { generateRandomPalette, generateHarmoniousPalette } from '@/lib/colorUtils';
import { generateId, exportPaletteAsCSS, exportPaletteAsJSON, downloadFile, saveToStorage, getFromStorage } from '@/lib/utils';
import { useKeyboardShortcuts, createPaletteShortcuts } from '@/lib/useKeyboardShortcuts';
import { useToast } from './ui/Toast';
import { ColorCard } from './ColorCard';
import { Button } from './ui/Button';
// import { HelpModal } from './HelpModal';
// import { AccessibilityChecker } from './AccessibilityChecker';

type PaletteMode = 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic';

export function PaletteGenerator() {
  const [currentPalette, setCurrentPalette] = useState<Color[]>([]);
  const [paletteSize, setPaletteSize] = useState(5);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('random');
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [savedPalettes, setSavedPalettes] = useState<PaletteType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);
  // const [showAccessibility, setShowAccessibility] = useState(false);
  
  const { addToast } = useToast();

  // 키보드 단축키 설정은 관련 함수 선언 이후에 등록하기 위해 useEffect에서 처리
  // 훅 규칙을 지키기 위해, 현재는 단축키 비활성화. 필요시 의존성 정리 후 활성화.
  const shortcuts = createPaletteShortcuts({
    generateNew: () => {},
    save: () => {},
    exportCSS: () => {},
    exportJSON: () => {},
    toggleHelp: () => {},
  });
  useKeyboardShortcuts(shortcuts, false);

  // 컴포넌트 마운트 시 저장된 팔레트 불러오기
  useEffect(() => {
    const saved = getFromStorage<PaletteType[]>('saved-palettes', []);
    setSavedPalettes(saved);
    
    // 초기 팔레트 생성
    generateNewPalette();
  }, []);

  const generateNewPalette = async () => {
    setIsGenerating(true);
    
    // 약간의 지연으로 로딩 효과 추가
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let newColors: Color[];
    
    if (paletteMode === 'random') {
      newColors = generateRandomPalette(paletteSize);
    } else {
      newColors = generateHarmoniousPalette(baseColor, paletteMode, paletteSize);
    }
    
    setCurrentPalette(newColors);
    setIsGenerating(false);
  };

  const savePalette = () => {
    if (currentPalette.length === 0) return;
    
    const newPalette: PaletteType = {
      id: generateId(),
      name: `Palette ${savedPalettes.length + 1}`,
      colors: currentPalette,
      createdAt: new Date(),
    };
    
    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    saveToStorage('saved-palettes', updatedPalettes);
    
    addToast({
      type: 'success',
      message: '팔레트가 저장되었습니다!',
    });
  };

  const loadPalette = (palette: PaletteType) => {
    setCurrentPalette(palette.colors);
    addToast({
      type: 'info',
      message: `${palette.name}을(를) 불러왔습니다`,
    });
  };

  const exportAsCSS = () => {
    if (currentPalette.length === 0) return;
    const css = exportPaletteAsCSS(currentPalette, 'my-palette');
    downloadFile(css, 'palette.css', 'text/css');
    addToast({
      type: 'success',
      message: 'CSS 파일이 다운로드되었습니다!',
    });
  };

  const exportAsJSON = () => {
    if (currentPalette.length === 0) return;
    const json = exportPaletteAsJSON(currentPalette, 'My Palette');
    downloadFile(json, 'palette.json', 'application/json');
    addToast({
      type: 'success',
      message: 'JSON 파일이 다운로드되었습니다!',
    });
  };

  const modeLabels: Record<PaletteMode, string> = {
    random: '랜덤',
    monochromatic: '단색조',
    analogous: '인접색',
    complementary: '보색',
    triadic: '삼색조',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 컨트롤 패널 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* 팔레트 모드 선택 */}
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-gray-600" />
            <select
              value={paletteMode}
              onChange={(e) => setPaletteMode(e.target.value as PaletteMode)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(modeLabels).map(([mode, label]) => (
                <option key={mode} value={mode}>{label}</option>
              ))}
            </select>
          </div>

          {/* 기준 색상 (조화 모드일 때만) */}
          {paletteMode !== 'random' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">기준 색상:</label>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-mono text-gray-600">{baseColor}</span>
            </div>
          )}

          {/* 팔레트 크기 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">색상 개수:</label>
            <select
              value={paletteSize}
              onChange={(e) => setPaletteSize(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[3, 4, 5, 6, 7, 8].map(size => (
                <option key={size} value={size}>{size}개</option>
              ))}
            </select>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={generateNewPalette}
            isLoading={isGenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            새 팔레트 생성
          </Button>

          <Button
            variant="outline"
            onClick={savePalette}
            disabled={currentPalette.length === 0}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            저장
          </Button>

          <Button
            variant="outline"
            onClick={exportAsCSS}
            disabled={currentPalette.length === 0}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            CSS 내보내기
          </Button>

          <Button
            variant="outline"
            onClick={exportAsJSON}
            disabled={currentPalette.length === 0}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            JSON 내보내기
          </Button>

          {/* 도움말 버튼 비활성화 (모달 미사용) */}

          {/* 접근성 체크 비활성화 (컴포넌트 미사용) */}
        </div>
      </div>

      {/* 현재 팔레트 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">현재 팔레트</h2>
        {currentPalette.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentPalette.map((color, index) => (
              <ColorCard key={`${color.hex}-${index}`} color={color} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Palette size={48} className="mx-auto mb-4 text-gray-300" />
            <p>팔레트를 생성해보세요!</p>
          </div>
        )}
      </div>

      {/* 저장된 팔레트들 */}
      {savedPalettes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">저장된 팔레트</h2>
          <div className="space-y-4">
            {savedPalettes.slice(-5).reverse().map((palette) => (
              <div
                key={palette.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => loadPalette(palette)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{palette.name}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(palette.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex gap-2">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}