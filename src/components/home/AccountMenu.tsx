'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './AccountMenu.module.css';

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
  const tone = light ? '' : ` ${styles.dark}`;
  const tab = open ? 0 : -1;

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
        className={styles.avatar + tone}
      >
        {initials(email)}
      </button>

      <div id={menuId} role="menu" aria-label="Account" data-open={open} className={styles.menu + tone}>
        <div className={styles.who}>
          <div className={styles.name}>{local}</div>
          <div className={styles.email}>{email}</div>
        </div>
        <div className={styles.rule} />
        <div className={styles.group}>
          <button type="button" role="menuitem" tabIndex={tab} className={styles.item} onClick={() => { setOpen(false); onDashboard('user'); }}>
            Dashboard
          </button>
          {isAdmin && (
            <button type="button" role="menuitem" tabIndex={tab} className={styles.item} onClick={() => { setOpen(false); onDashboard('admin'); }}>
              Admin
            </button>
          )}
        </div>
        <div className={styles.rule} />
        <div className={styles.group}>
          <button type="button" role="menuitem" tabIndex={tab} className={styles.item} onClick={() => { setOpen(false); onSignOut(); }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
