'use client';

import dynamic from 'next/dynamic';

const HalftoneWave = dynamic(
  () => import('./HalftoneWave').then((mod) => mod.HalftoneWave),
  { ssr: false }
);

export function HalftoneWaveWrapper() {
  return <HalftoneWave />;
}
