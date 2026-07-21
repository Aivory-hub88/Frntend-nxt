import { FadeUp } from './FadeUp';
import Link from 'next/link';

export default function BastionContact() {
  return (
    <section className="bg-[#050505] text-white py-32 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <FadeUp className="flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8 text-[#FFFFFF]">
            Talk to our team.
          </h2>
          <p className="text-lg text-[#B3B3B3] font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Learn how Aivory Bastion helps organizations build autonomous infrastructure defense.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href="/contact" 
              className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              Book Enterprise Demo
            </Link>
            <Link 
              href="mailto:contact@aivory.id" 
              className="text-white border border-[#1F1F1F] bg-[#101010] px-8 py-4 rounded-full font-medium hover:bg-[#1F1F1F] transition-colors w-full sm:w-auto"
            >
              contact@aivory.id
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
