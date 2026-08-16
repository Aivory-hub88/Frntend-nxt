const LOCALE_PREFIXES = ["ar", "ja", "ko", "zh", "de", "nl", "es", "pt", "fr"] as const;

/**
 * Every language variant of a given English page ("about" | "company"),
 * for the Next.js Metadata `alternates.languages` map. English has no
 * prefix (it's the canonical/original path); every other locale lives
 * under /{locale}/{path}. Kept as one source of truth so hreflang stays
 * consistent as languages get added -- 10 hand-typed maps drift eventually.
 */
export function buildLanguageAlternates(path: "about" | "company"): Record<string, string> {
  const languages: Record<string, string> = {
    en: `/${path}`,
    "x-default": `/${path}`,
  };
  for (const locale of LOCALE_PREFIXES) {
    languages[locale] = `/${locale}/${path}`;
  }
  return languages;
}
