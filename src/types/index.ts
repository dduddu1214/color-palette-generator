// types/index.ts

export interface Color {
    hex: string;
    rgb: {
      r: number;
      g: number;
      b: number;
    };
    hsl: {
      h: number;
      s: number;
      l: number;
    };
    name?: string;
  }
  
  export interface Palette {
    id: string;
    name: string;
    colors: Color[];
    createdAt: Date;
    isFavorite?: boolean;
  }
  
  export type ColorFormat = 'hex' | 'rgb' | 'hsl';
  
  export interface PaletteGeneratorProps {
    initialPaletteSize?: number;
    maxPaletteSize?: number;
  }
  
  export interface ColorCardProps {
    color: Color;
    format: ColorFormat;
    onFormatChange?: (format: ColorFormat) => void;
    onColorCopy?: (color: Color, format: ColorFormat) => void;
  }
  
  export interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }