'use client';

import { motion } from 'framer-motion';

export default function BastionVisualHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden pt-20">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.35, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1.15, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 2.4,
            ease: [0.16, 1, 0.3, 1], // Smooth monumental ease-out
          }}
          className="w-full flex justify-center"
        >
          <img 
            src="/Bastion_Hero_Section.svg" 
            alt="Aivory Bastion" 
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
