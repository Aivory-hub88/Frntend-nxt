'use client';

import { useEffect, useId, useRef, useState } from 'react';

/** "irfan.reichmann@x" -> "IR", "dana@x" -> "DA". */
function initials(email: string) {
  const local = (email.split('@')[0] || '').replace(/[^a-zA-Z0-9._-]/g, '');
  const parts = local.split(/[._-]+/).filter(Boolean);
  const s = parts.length > 1 ? parts[0][0] + parts[1][0] : local.slice(0, 2);
  return (s || '?').toUpperCase();
}

/**
 * Signed-in account control for the landing nav: an initials avatar that opens
 * a small menu (who you are, Dashboard, Admin for admins, Sign out). The nav
 * keeps its own solid Dashboard button next to it, so the main action stays one
 * click away.
 */
export default function AccountMenu({
  email,
  isAdmin,
  light,
  onDashboard,
  onSignOut,
}: {
  email: string;
  isAdmin: boolean;
  light: boolean;
  onDashboard: (target: 'user' | 'admin') => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const items = [...(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
        if (!items.length) return;
        e.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[next].focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    // Focus the first item so the keyboard lands inside the menu.
    root.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const local = email.split('@')[0] || email;
  const item =
    'block w-full text-left px-3 py-2 rounded-lg text-[14px] text-[#0f1f26] bg-transparent border-0 cursor-pointer hover:bg-[#0f1f26]/[0.06] focus-visible:bg-[#0f1f26]/[0.06] outline-none transition-colors duration-150';

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${email}`}
        className={`grid place-items-center w-9 h-9 rounded-full text-[12px] font-semibold tracking-[0.02em] cursor-pointer border-0 transition-[box-shadow,transform] duration-200 active:scale-[0.96] ${
          light
            ? 'text-[#0f1f26] shadow-[inset_0_0_0_1px_rgba(15,31,38,0.14)] hover:shadow-[inset_0_0_0_1px_rgba(15,31,38,0.32)]'
            : 'text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]'
        }`}
        style={{
          background: light
            ? 'radial-gradient(circle at 30% 25%, #ffffff, #e6e9f5 55%, #d9def0)'
            : 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.28), rgba(255,255,255,0.08))',
        }}
      >
        {initials(email)}
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label="Account"
        // Opening flips visibility at once (so the first item can take focus);
        // closing lets it lag until the fade ends.
        className={`absolute right-0 top-[calc(100%+10px)] w-[240px] p-1.5 rounded-[14px] origin-top-right duration-150 ease-out ${
          open
            ? 'visible opacity-100 scale-100 transition-[opacity,transform]'
            : 'invisible opacity-0 scale-[0.96] pointer-events-none transition-[opacity,transform,visibility]'
        }`}
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 0 0 1px rgba(15,31,38,0.08), 0 18px 40px -18px rgba(15,31,38,0.35)',
        }}
      >
        <div className="px-3 pt-2 pb-2.5">
          <div className="text-[14px] font-medium text-[#0f1f26] truncate">{local}</div>
          <div className="text-[12px] text-[#0f1f26]/55 truncate">{email}</div>
        </div>
        <div className="h-px mx-1.5 bg-[#0f1f26]/[0.08]" />
        <div className="py-1">
          <button type="button" role="menuitem" tabIndex={open ? 0 : -1} className={item} onClick={() => { setOpen(false); onDashboard('user'); }}>
            Dashboard
          </button>
          {isAdmin && (
            <button type="button" role="menuitem" tabIndex={open ? 0 : -1} className={item} onClick={() => { setOpen(false); onDashboard('admin'); }}>
              Admin
            </button>
          )}
        </div>
        <div className="h-px mx-1.5 bg-[#0f1f26]/[0.08]" />
        <div className="pt-1">
          <button type="button" role="menuitem" tabIndex={open ? 0 : -1} className={item} onClick={() => { setOpen(false); onSignOut(); }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
