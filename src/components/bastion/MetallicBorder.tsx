import React, { ReactNode } from 'react';

interface MetallicBorderProps {
  children: ReactNode;
  borderRadius?: string;
  className?: string;
}

export function MetallicBorder({ children, borderRadius = '24px', className = "relative w-full h-full flex group" }: MetallicBorderProps) {
  return (
    <div 
      className={`${className} overflow-hidden`} 
      style={{ borderRadius, padding: '1px', background: 'transparent' }}
    >
      <div 
        className="absolute inset-[-100%] origin-center group-hover:opacity-100 opacity-60 transition-opacity duration-300"
        style={{
          animation: 'spin 4s linear infinite',
          background: 'conic-gradient(from 0deg, transparent 30%, rgba(200, 205, 215, 0.4) 45%, rgba(255, 255, 255, 1) 50%, rgba(200, 205, 215, 0.4) 55%, transparent 70%)',
          zIndex: 0,
          willChange: 'transform'
        }}
      />
      <div 
        className="relative z-10 w-full h-full flex flex-col"
        style={{ 
          borderRadius: `calc(${borderRadius} - 1px)`,
          background: 'var(--metallic-inner-bg, #050505)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
