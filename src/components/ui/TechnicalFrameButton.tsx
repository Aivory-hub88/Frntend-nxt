import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type TechnicalFrameButtonCommonProps = {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'compact' | 'heroCompact';
  /**
   * Which ground the button sits on. `light` (default) is the white-on-dark
   * frame every existing consumer uses; `dark` is its inverse, for the light
   * hero card — where a white outline and white type render as nothing.
   */
  tone?: 'light' | 'dark';
};

type TechnicalFrameLinkProps = TechnicalFrameButtonCommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & {
    href: string;
  };

type TechnicalFrameNativeButtonProps = TechnicalFrameButtonCommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: never;
  };

export type TechnicalFrameButtonProps =
  | TechnicalFrameLinkProps
  | TechnicalFrameNativeButtonProps;

// Transparent by default -- the corner-bracket frame carries the button's
// identity, not a solid fill. Every consumer (nav CTAs, hero CTA, footer
// CTAs, modal submit) inherits this in one place; a caller that still wants
// a filled button passes `bg-*` in `className` to override.
const baseClassName =
  'group relative inline-flex items-center justify-center border bg-transparent font-mono font-medium uppercase transition-[border-color,color,box-shadow,transform] duration-300 active:scale-[0.97] active:duration-[160ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45';

const toneClassNames = {
  light:
    'border-white/20 text-white/85 hover:border-white/45 hover:bg-white/[0.04] hover:text-white hover:shadow-[0_0_24px_rgba(255,255,255,0.07)] focus-visible:ring-white/70 focus-visible:ring-offset-black',
  dark:
    'border-black/25 text-black/80 hover:border-black/50 hover:bg-black/[0.04] hover:text-black hover:shadow-[0_0_24px_rgba(0,0,0,0.07)] focus-visible:ring-black/70 focus-visible:ring-offset-white',
} as const;

const cornerClassNames = {
  light: 'border-white/60 group-hover:border-white',
  dark: 'border-black/60 group-hover:border-black',
} as const;

const sizeClassNames = {
  default: 'min-h-[52px] px-8 py-3.5 text-[11px] tracking-[0.16em]',
  compact: 'min-h-[29px] px-[18px] py-2 text-[10px] tracking-[0.08em]',
  // ~15% down from `default` -- used where the button needs to sit lighter
  // (e.g. the hero CTA) without touching every other TechnicalFrameButton.
  heroCompact: 'min-h-[44px] px-7 py-3 text-[9px] tracking-[0.14em]',
} as const;

function TechnicalFrameContent({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const corner = cornerClassNames[tone];
  return (
    <>
      <span aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t transition-colors ${corner}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t transition-colors ${corner}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l transition-colors ${corner}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r transition-colors ${corner}`} />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </>
  );
}

export function TechnicalFrameButton(props: TechnicalFrameButtonProps) {
  if (typeof props.href === 'string') {
    const { href, children, className = '', size = 'default', tone = 'light', ...linkProps } =
      props as TechnicalFrameLinkProps;
    return (
      <Link
        href={href}
        {...linkProps}
        data-button-style="technical-frame"
        className={`${baseClassName} ${toneClassNames[tone]} ${sizeClassNames[size]} ${className}`.trim()}
      >
        <TechnicalFrameContent tone={tone}>{children}</TechnicalFrameContent>
      </Link>
    );
  }

  const { children, className = '', size = 'default', tone = 'light', type = 'button', ...buttonProps } =
    props as TechnicalFrameNativeButtonProps;
  return (
    <button
      {...buttonProps}
      type={type}
      data-button-style="technical-frame"
      className={`${baseClassName} ${toneClassNames[tone]} ${sizeClassNames[size]} ${className}`.trim()}
    >
      <TechnicalFrameContent tone={tone}>{children}</TechnicalFrameContent>
    </button>
  );
}
