import React, { ReactNode } from 'react';

interface MetallicBorderProps {
  children: ReactNode;
  borderRadius?: string;
}

export function MetallicBorder({ children, borderRadius = '24px' }: MetallicBorderProps) {
  return (
    <div className="relative w-full h-full flex group">
      {children}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          overflow: 'hidden',
          zIndex: 50
        }}
      >
        <div 
          className="absolute inset-[-100%] origin-center group-hover:opacity-100 opacity-60 transition-opacity duration-300"
          style={{
            animation: 'spin 4s linear infinite',
            background: 'conic-gradient(from 0deg, transparent 30%, rgba(200, 205, 215, 0.4) 45%, rgba(255, 255, 255, 1) 50%, rgba(200, 205, 215, 0.4) 55%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
}
