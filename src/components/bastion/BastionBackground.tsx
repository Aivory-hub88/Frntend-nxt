import { HalftoneWaveWrapper } from '@/components/ui/HalftoneWaveWrapper';

export default function BastionBackground({ 
  className = "fixed inset-0 z-0 pointer-events-none overflow-hidden" 
}: { 
  className?: string 
}) {
  return (
    <div className={className}>
      <HalftoneWaveWrapper />
    </div>
  );
}
