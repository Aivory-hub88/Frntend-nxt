import { FadeUp } from './FadeUp';

export default function BastionVisualHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden pt-20">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center items-center">
        <FadeUp className="w-full flex justify-center">
          <img 
            src="/Bastion_Hero_Section.svg" 
            alt="Aivory Bastion" 
            className="w-full h-auto object-contain"
            style={{ transform: 'scale(1.15)', transformOrigin: 'center' }}
          />
        </FadeUp>
      </div>
    </section>
  );
}
