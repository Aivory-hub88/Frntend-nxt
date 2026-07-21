import { FadeUp, FadeUpChild } from './FadeUp';

// Common stroke properties for geometric backgrounds
const s = "stroke-white/20 stroke-[0.5] fill-transparent";

const SvgCloud = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <circle cx="50" cy="110" r="20" className={s} />
    <circle cx="50" cy="110" r="40" className={s} />
    <circle cx="50" cy="110" r="60" className={s} />
    <circle cx="50" cy="110" r="80" className={s} />
    <circle cx="50" cy="110" r="100" className={s} />
    <circle cx="50" cy="110" r="120" className={s} />
  </svg>
);

const SvgPrivate = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <rect x="42" y="52" width="16" height="14" rx="1.5" className={s} />
    <path d="M46 52 V47 A4 4 0 0 1 54 47 V52" className={s} />
    <rect x="25" y="35" width="50" height="50" rx="4" className={s} />
    <rect x="10" y="20" width="80" height="80" rx="8" className={s} />
    <rect x="-5" y="5" width="110" height="110" rx="12" className={s} />
  </svg>
);

const SvgOnPrem = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <line x1="0" y1="20" x2="100" y2="20" className={s} />
    <line x1="0" y1="40" x2="100" y2="40" className={s} />
    <line x1="0" y1="60" x2="100" y2="60" className={s} />
    <line x1="0" y1="80" x2="100" y2="80" className={s} />
    <line x1="0" y1="100" x2="100" y2="100" className={s} />
    <line x1="75" y1="30" x2="85" y2="30" className="stroke-white/30 stroke-[1]" strokeDasharray="3 3" />
    <line x1="75" y1="50" x2="85" y2="50" className="stroke-white/30 stroke-[1]" strokeDasharray="3 3" />
    <line x1="75" y1="70" x2="85" y2="70" className="stroke-white/30 stroke-[1]" strokeDasharray="3 3" />
    <line x1="75" y1="90" x2="85" y2="90" className="stroke-white/30 stroke-[1]" strokeDasharray="3 3" />
  </svg>
);

const SvgHybrid = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0 overflow-hidden">
    <circle cx="0" cy="60" r="20" className={s} />
    <circle cx="0" cy="60" r="40" className={s} />
    <circle cx="0" cy="60" r="60" className={s} />
    <circle cx="0" cy="60" r="80" className={s} />
    <circle cx="100" cy="60" r="20" className={s} />
    <circle cx="100" cy="60" r="40" className={s} />
    <circle cx="100" cy="60" r="60" className={s} />
    <circle cx="100" cy="60" r="80" className={s} />
  </svg>
);

const SvgEdge = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <line x1="50" y1="0" x2="50" y2="120" className={s} />
    <circle cx="15" cy="60" r="15" className={s} />
    <circle cx="15" cy="60" r="30" className={s} />
    <circle cx="15" cy="60" r="45" className={s} />
    <circle cx="85" cy="60" r="15" className={s} />
    <circle cx="85" cy="60" r="30" className={s} />
    <circle cx="85" cy="60" r="45" className={s} />
  </svg>
);

const SvgContainer = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 z-0">
    <path d="M-10 90 L50 65 L110 90" className={s} />
    <path d="M-10 70 L50 45 L110 70" className={s} />
    <path d="M-10 50 L50 25 L110 50" className={s} />
    <path d="M-10 30 L50 5 L110 30" className={s} />
    <path d="M-10 110 L50 85 L110 110" className={s} />
    <rect x="35" y="80" width="30" height="20" className={s} />
    <rect x="40" y="85" width="20" height="10" className={s} />
  </svg>
);

const deployments = [
  { name: 'Cloud', bg: SvgCloud },
  { name: 'Private Infrastructure', bg: SvgPrivate },
  { name: 'On-Premises', bg: SvgOnPrem },
  { name: 'Hybrid Cloud', bg: SvgHybrid },
  { name: 'Edge', bg: SvgEdge },
  { name: 'Container Platforms', bg: SvgContainer }
];

export default function BastionDeployment() {
  return (
    <section className="bg-[#050505] text-white py-32 border-t border-[#1F1F1F] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <FadeUp className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl lg:text-[72px] tracking-tight font-light leading-tight text-[#FFFFFF] max-w-4xl">
            From one to many environments
          </h2>
        </FadeUp>
        
        <FadeUp staggerChildren={0.1} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {deployments.map((deployment, index) => {
            const Bg = deployment.bg;
            return (
              <FadeUpChild 
                key={index} 
                className="group relative bg-black rounded-[24px] border border-white/10 overflow-hidden aspect-[3/4] transition-colors hover:border-white/20 flex items-end p-6 md:p-8"
              >
                <Bg />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <span className="relative z-20 text-sm md:text-base font-medium text-[#EAEAEA] group-hover:text-white transition-colors">
                  {deployment.name}
                </span>
              </FadeUpChild>
            );
          })}
        </FadeUp>
      </div>
    </section>
  );
}
