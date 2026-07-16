"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SpotlightButton } from "@/components/ui/SpotlightButton";

/* ─── Custom Icons ─── */
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="sh1"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient
          id="shRim"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF5CC" />
          <stop offset="1" stopColor="#995500" />
        </linearGradient>
        <linearGradient
          id="shGloss"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="shadowSh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.6"
          />
        </filter>
      </defs>
      <g filter="url(#shadowSh)">
        <path
          d="M50 10 C50 10 15 20 15 20 C15 55 15 75 50 95 C85 75 85 55 85 20 C85 20 50 10 50 10 Z"
          fill="url(#shRim)"
        />
        <path
          d="M50 14 C50 14 20 23 20 23 C20 53 20 71 50 88 C80 71 80 53 80 23 C80 23 50 14 50 14 Z"
          fill="url(#sh1)"
        />
        <path
          d="M50 14 C50 14 20 23 20 23 C20 40 80 40 80 23 C80 23 50 14 50 14 Z"
          fill="url(#shGloss)"
        />
        <path
          d="M32 50 L45 62 L68 38"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function CpuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="cpuB"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#444444" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
        <linearGradient
          id="cpuRim"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#888888" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient
          id="cpuG"
          x1="0"
          y1="0"
          x2="0"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="pin"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#B36B00" />
        </linearGradient>
        <filter id="shadowCpu" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      <g filter="url(#shadowCpu)">
        <rect x="25" y="8" width="8" height="15" fill="url(#pin)" rx="3" />
        <rect x="46" y="8" width="8" height="15" fill="url(#pin)" rx="3" />
        <rect x="67" y="8" width="8" height="15" fill="url(#pin)" rx="3" />
        <rect x="25" y="77" width="8" height="15" fill="url(#pin)" rx="3" />
        <rect x="46" y="77" width="8" height="15" fill="url(#pin)" rx="3" />
        <rect x="67" y="77" width="8" height="15" fill="url(#pin)" rx="3" />
        <rect x="8" y="25" width="15" height="8" fill="url(#pin)" rx="3" />
        <rect x="8" y="46" width="15" height="8" fill="url(#pin)" rx="3" />
        <rect x="8" y="67" width="15" height="8" fill="url(#pin)" rx="3" />
        <rect x="77" y="25" width="15" height="8" fill="url(#pin)" rx="3" />
        <rect x="77" y="46" width="15" height="8" fill="url(#pin)" rx="3" />
        <rect x="77" y="67" width="15" height="8" fill="url(#pin)" rx="3" />

        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          rx="16"
          fill="url(#cpuRim)"
        />
        <rect x="17" y="17" width="66" height="66" rx="14" fill="url(#cpuB)" />
        <rect x="17" y="17" width="66" height="30" rx="14" fill="url(#cpuG)" />

        <rect x="32" y="32" width="36" height="36" rx="6" fill="url(#pin)" />
        <rect x="35" y="35" width="30" height="30" rx="4" fill="#333333" />
        <rect x="42" y="42" width="16" height="16" rx="2" fill="#00E5FF" />
      </g>
    </svg>
  );
}

function GdprIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="gRim"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#66AAFF" />
          <stop offset="1" stopColor="#002266" />
        </linearGradient>
        <linearGradient
          id="gBase"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0055FF" />
          <stop offset="1" stopColor="#001144" />
        </linearGradient>
        <linearGradient
          id="gGloss"
          x1="0"
          y1="0"
          x2="0"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="shadowG" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
        <polygon
          id="star3d"
          points="0,-4 1.17,-0.38 5,-0.38 1.91,1.86 3.09,5.62 0,3.38 -3.09,5.62 -1.91,1.86 -5,-0.38 -1.17,-0.38"
          fill="#FFD700"
        />
      </defs>
      <g filter="url(#shadowG)">
        <circle cx="50" cy="50" r="46" fill="url(#gRim)" />
        <circle cx="50" cy="50" r="43" fill="url(#gBase)" />
        <path
          d="M9 50 A41 41 0 0 1 91 50 C91 25 70 20 50 20 C30 20 9 25 9 50 Z"
          fill="url(#gGloss)"
        />

        <use href="#star3d" x="50" y="16" />
        <use href="#star3d" x="67" y="20.5" />
        <use href="#star3d" x="80" y="33" />
        <use href="#star3d" x="84" y="50" />
        <use href="#star3d" x="80" y="67" />
        <use href="#star3d" x="67" y="79.5" />
        <use href="#star3d" x="50" y="84" />
        <use href="#star3d" x="33" y="79.5" />
        <use href="#star3d" x="20" y="67" />
        <use href="#star3d" x="16" y="50" />
        <use href="#star3d" x="20" y="33" />
        <use href="#star3d" x="33" y="20.5" />

        <text
          x="50"
          y="58"
          fill="#FFFFFF"
          fontFamily="-apple-system, sans-serif"
          fontWeight="800"
          fontSize="22"
          textAnchor="middle"
          style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }}
        >
          GDPR
        </text>
      </g>
    </svg>
  );
}

function ServerOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="srvB"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#666666" />
          <stop offset="1" stopColor="#222222" />
        </linearGradient>
        <linearGradient
          id="srvF"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#333333" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient
          id="redSlash"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF3B30" />
          <stop offset="1" stopColor="#990000" />
        </linearGradient>
        <linearGradient
          id="redGloss"
          x1="0"
          y1="0"
          x2="50"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="shadowSrv" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
        <filter id="shadowRed" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="2"
            dy="2"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.7"
          />
        </filter>
      </defs>
      <g filter="url(#shadowSrv)">
        <rect x="18" y="12" width="64" height="76" rx="8" fill="url(#srvB)" />
        <rect x="22" y="16" width="56" height="68" rx="4" fill="url(#srvF)" />

        <rect x="28" y="26" width="44" height="12" rx="2" fill="#222222" />
        <circle cx="34" cy="32" r="3" fill="#00E5FF" />
        <circle cx="44" cy="32" r="3" fill="#333333" />

        <rect x="28" y="44" width="44" height="12" rx="2" fill="#222222" />
        <circle cx="34" cy="50" r="3" fill="#00E5FF" />
        <circle cx="44" cy="50" r="3" fill="#333333" />

        <rect x="28" y="62" width="44" height="12" rx="2" fill="#222222" />
        <circle cx="34" cy="68" r="3" fill="#00E5FF" />
        <circle cx="44" cy="68" r="3" fill="#333333" />
      </g>
      <g filter="url(#shadowRed)">
        <path
          d="M15 85 L85 15"
          stroke="url(#redSlash)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M18 82 L82 18"
          stroke="url(#redGloss)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="lShackle"
          x1="0"
          y1="0"
          x2="100"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6E6E6" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#808080" />
        </linearGradient>
        <linearGradient
          id="lBody"
          x1="0"
          y1="40"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#E68A00" />
        </linearGradient>
        <linearGradient
          id="lGloss"
          x1="0"
          y1="40"
          x2="0"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="shadowL" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      <g filter="url(#shadowL)">
        <path
          d="M30 45 V28 C30 15 70 15 70 28 V45"
          stroke="url(#lShackle)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M30 45 V28 C30 15 70 15 70 28 V45"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />

        <rect x="20" y="42" width="60" height="48" rx="10" fill="url(#lBody)" />
        <rect
          x="20"
          y="42"
          width="60"
          height="24"
          rx="10"
          fill="url(#lGloss)"
        />

        <circle cx="50" cy="60" r="6" fill="#333333" />
        <path d="M48 60 L46 76 H54 L52 60 Z" fill="#333333" />
      </g>
    </svg>
  );
}

function ShieldLockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="slBase"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0A84FF" />
          <stop offset="1" stopColor="#003399" />
        </linearGradient>
        <linearGradient
          id="slRim"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#66AAFF" />
          <stop offset="1" stopColor="#001144" />
        </linearGradient>
        <linearGradient
          id="slGloss"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="slLock"
          x1="0"
          y1="45"
          x2="100"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#E68A00" />
        </linearGradient>
        <filter id="shadowSL" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.6"
          />
        </filter>
        <filter id="shadowLock" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      <g filter="url(#shadowSL)">
        <path
          d="M50 8 C50 8 12 18 12 18 C12 55 12 75 50 96 C88 75 88 55 88 18 C88 18 50 8 50 8 Z"
          fill="url(#slRim)"
        />
        <path
          d="M50 12 C50 12 16 21 16 21 C16 53 16 71 50 89 C84 71 84 53 84 21 C84 21 50 12 50 12 Z"
          fill="url(#slBase)"
        />
        <path
          d="M50 12 C50 12 16 21 16 21 C16 40 84 40 84 21 C84 21 50 12 50 12 Z"
          fill="url(#slGloss)"
        />
      </g>
      <g filter="url(#shadowLock)">
        <path
          d="M40 45 V35 C40 25 60 25 60 35 V45"
          stroke="#E6E6E6"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect x="34" y="45" width="32" height="26" rx="6" fill="url(#slLock)" />
        <circle cx="50" cy="55" r="4" fill="#333333" />
        <path d="M49 55 L48 64 H52 L51 55 Z" fill="#333333" />
      </g>
    </svg>
  );
}

function ShareOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="soNode"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#32ADE6" />
          <stop offset="1" stopColor="#004488" />
        </linearGradient>
        <linearGradient
          id="soLine"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6E6E6" />
          <stop offset="1" stopColor="#888888" />
        </linearGradient>
        <linearGradient
          id="redSlash"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF3B30" />
          <stop offset="1" stopColor="#990000" />
        </linearGradient>
        <linearGradient
          id="redGloss"
          x1="0"
          y1="0"
          x2="50"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="shadowSO" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
        <filter id="shadowRed" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="2"
            dy="2"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.7"
          />
        </filter>
      </defs>
      <g filter="url(#shadowSO)">
        <path
          d="M30 50 L70 25"
          stroke="url(#soLine)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M30 50 L70 75"
          stroke="url(#soLine)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <circle cx="30" cy="50" r="14" fill="url(#soNode)" />
        <circle cx="30" cy="45" r="10" fill="#FFFFFF" fillOpacity="0.3" />

        <circle cx="70" cy="25" r="14" fill="url(#soNode)" />
        <circle cx="70" cy="20" r="10" fill="#FFFFFF" fillOpacity="0.3" />

        <circle cx="70" cy="75" r="14" fill="url(#soNode)" />
        <circle cx="70" cy="70" r="10" fill="#FFFFFF" fillOpacity="0.3" />
      </g>
      <g filter="url(#shadowRed)">
        <path
          d="M15 85 L85 15"
          stroke="url(#redSlash)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M18 82 L82 18"
          stroke="url(#redGloss)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function BriefcaseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="bcBase"
          x1="0"
          y1="20"
          x2="0"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5A2B" />
          <stop offset="1" stopColor="#3E2713" />
        </linearGradient>
        <linearGradient
          id="bcRim"
          x1="0"
          y1="20"
          x2="0"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A06934" />
          <stop offset="1" stopColor="#25170B" />
        </linearGradient>
        <linearGradient
          id="bcGloss"
          x1="0"
          y1="20"
          x2="0"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="bcGold"
          x1="0"
          y1="30"
          x2="0"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#CC8800" />
        </linearGradient>
        <filter id="shadowBC" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.6"
          />
        </filter>
      </defs>
      <g filter="url(#shadowBC)">
        <path
          d="M38 25 V14 C38 10 62 10 62 14 V25"
          stroke="#A06934"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect x="14" y="24" width="72" height="62" rx="8" fill="url(#bcRim)" />
        <rect x="16" y="26" width="68" height="58" rx="6" fill="url(#bcBase)" />
        <rect
          x="16"
          y="26"
          width="68"
          height="20"
          rx="6"
          fill="url(#bcGloss)"
        />

        <path
          d="M16 40 Q 50 50 84 40"
          fill="none"
          stroke="#25170B"
          strokeWidth="3"
        />

        <rect x="28" y="36" width="10" height="12" rx="3" fill="url(#bcGold)" />
        <rect x="62" y="36" width="10" height="12" rx="3" fill="url(#bcGold)" />
      </g>
    </svg>
  );
}

const privacyPoints = [
  {
    text: "We don't train on your data.",
    icon: <ShieldIcon className="w-6 h-6 shrink-0 text-[#D4AF37]" />,
  },
  {
    text: "Processed & Stored Locally",
    icon: <CpuIcon className="w-6 h-6 shrink-0 text-[#D4AF37]" />,
  },
  {
    text: "GDPR compliant by design.",
    icon: <GdprIcon className="w-6 h-6 shrink-0" />,
  },
];

const badges = [
  {
    text: "Zero server logging",
    icon: <ServerOffIcon className="w-6 h-6 shrink-0" />,
  },
  {
    text: "End to end private",
    icon: <LockIcon className="w-6 h-6 shrink-0" />,
  },
  {
    text: "Encrypted at rest",
    icon: <ShieldLockIcon className="w-6 h-6 shrink-0" />,
  },
  {
    text: "No third-party sharing",
    icon: <ShareOffIcon className="w-6 h-6 shrink-0" />,
  },
  {
    text: "Enterprise grade",
    icon: <BriefcaseIcon className="w-6 h-6 shrink-0" />,
  },
];

const trustBadges = ["Enterprise Grade", "GDPR Compliant", "SOC 2 Ready"];

export default function PrivacySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "is-visible" : ""} w-full text-white pt-24 pb-12 font-sans`}
    >
      <div style={{ zoom: 0.85 }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              <SpotlightButton
                className="pointer-events-auto hover:-translate-y-0"
                style={{
                  borderWidth: "0.5px",
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.1)",
                  cursor: "default",
                }}
                icon={false}
              >
                Privacy &amp; Security
              </SpotlightButton>
            </div>
            <h2 className="no-word-split text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.2] mb-10">
              Your data stays
              <br />
              where it belongs.
            </h2>

            <div className="border-t border-white/20 pt-8 mt-12">
              <p className="text-lg md:text-xl font-light mb-12">
                No training. No logging. No exceptions. Everything runs in your
                browser.
              </p>

              {/* Privacy & Badges Stack (3-2-3) */}
              <div className="flex flex-col gap-6 md:gap-8 w-full max-w-5xl mx-auto items-center mt-12 mb-16">
                {/* Row 1: 3 boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                  {privacyPoints.map((point) => (
                    <SpotlightButton
                      key={point.text}
                      icon={point.icon}
                      roundedClass="rounded-md"
                      className="!items-start h-full w-full normal-case"
                      style={{
                        textTransform: "none",
                        backgroundColor: "rgba(20, 20, 26, 0.3)",
                        borderWidth: "0.1px",
                        borderStyle: "solid",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">
                        {point.text}
                      </p>
                    </SpotlightButton>
                  ))}
                </div>

                {/* Row 2: 2 boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full md:max-w-3xl mx-auto">
                  {badges.slice(0, 2).map((badge) => (
                    <SpotlightButton
                      key={badge.text}
                      icon={badge.icon}
                      roundedClass="rounded-md"
                      className="!items-start h-full w-full normal-case"
                      style={{
                        textTransform: "none",
                        backgroundColor: "rgba(20, 20, 26, 0.3)",
                        borderWidth: "0.1px",
                        borderStyle: "solid",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">
                        {badge.text}
                      </p>
                    </SpotlightButton>
                  ))}
                </div>

                {/* Row 3: 3 boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                  {badges.slice(2, 5).map((badge) => (
                    <SpotlightButton
                      key={badge.text}
                      icon={badge.icon}
                      roundedClass="rounded-md"
                      className="!items-start h-full w-full normal-case"
                      style={{
                        textTransform: "none",
                        backgroundColor: "rgba(20, 20, 26, 0.3)",
                        borderWidth: "0.1px",
                        borderStyle: "solid",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <p className="text-sm md:text-[15px] font-medium leading-snug whitespace-pre-line text-[#dadada] group-hover:text-white transition-colors">
                        {badge.text}
                      </p>
                    </SpotlightButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
