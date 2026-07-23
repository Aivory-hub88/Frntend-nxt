'use client';

import { HalftoneWaveWrapper } from '@/components/ui/HalftoneWaveWrapper';

interface BastionBackgroundProps {
  mode?: 'gradient-only' | 'flower-only' | 'all';
  scale?: number;
  className?: string;
  purpleColor?: string;
}

export default function BastionBackground({ 
  mode = 'all',
  scale = 1,
  className = "fixed inset-0 z-0 pointer-events-none overflow-hidden",
  purpleColor = "#2a545b"
}: BastionBackgroundProps) {
  if (mode === 'gradient-only') {
    return (
      <div className={className} aria-hidden="true">
        {/* Deep teal #2a545b ambient background wash for Bastion page */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(60% 50% at 50% 30%, rgba(42,84,91,0.28) 0%, rgba(15,30,35,0.12) 50%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(40% 40% at 30% 60%, rgba(42,84,91,0.22) 0%, transparent 70%), radial-gradient(45% 45% at 70% 50%, rgba(42,84,91,0.22) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      <div 
        className="w-full h-full flex items-center justify-center"
        style={scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'center center' } : undefined}
      >
        <HalftoneWaveWrapper purpleColor={purpleColor} />
      </div>
    </div>
  );
}
