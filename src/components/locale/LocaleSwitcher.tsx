import Link from "next/link";
import { ALL_LOCALES, LOCALE_LABELS, localeHref } from "@/lib/localeAlternates";
import type { LocalePath, SiteLocale } from "./LocaleSuggestionBanner";

/**
 * Always-visible language picker for the About/Company pages. Deliberately
 * NOT added to Navbar.tsx -- that file has pending uncommitted changes on
 * the VPS unrelated to this work, and touching it risked colliding with
 * that. Native <details>/<summary> needs no client JS: selecting a link
 * just navigates, closing the panel for free.
 */
export function LocaleSwitcher({
  currentLocale,
  path,
}: {
  currentLocale: SiteLocale;
  path: LocalePath;
}) {
  return (
    <div className="flex justify-end border-b border-white/10 bg-[#0a0a0a] px-4 py-2 sm:px-6">
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12px] text-white/70 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true">🌐</span>
          {LOCALE_LABELS[currentLocale]}
          <span aria-hidden="true" className="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-44 overflow-y-auto rounded-sm border border-white/10 bg-[#11110f] py-1 shadow-xl">
          {ALL_LOCALES.map((locale) => (
            <Link
              key={locale}
              href={localeHref(locale, path)}
              className={`block px-3 py-1.5 text-[13px] transition-colors ${
                locale === currentLocale
                  ? "bg-white/10 text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              {LOCALE_LABELS[locale]}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
