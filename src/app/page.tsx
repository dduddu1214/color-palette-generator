// src/app/page.tsx
import { PaletteGenerator } from '@/components/PaletteGenerator';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PaletteGenerator />
    </div>
  );
}