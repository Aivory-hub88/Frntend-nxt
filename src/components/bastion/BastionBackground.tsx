import { HalftoneWaveWrapper } from '@/components/ui/HalftoneWaveWrapper';

export default function BastionBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <HalftoneWaveWrapper />
    </div>
  );
}
