import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Manrope, Doto } from 'next/font/google';
import './globals.css';
import {
  DEFAULT_OG_IMAGE,
  JsonLd,
  buildSiteGraph,
  siteUrlFromHeaders,
} from '@/lib/seo';
import { LanguageProvider } from '@/components/context/LanguageContext';
import AiTrap from '@/components/security/AiTrap';
import CanaryLink from '@/components/security/CanaryLink';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const doto = Doto({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-doto',
  display: 'swap',
});

const SITE_NAME = 'Aivory';
const SITE_TITLE = 'Aivory — AI-Powered Business Transformation';
const SITE_DESCRIPTION =
  'From diagnostic to deployment — everything you need to integrate AI into your business operations.';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const siteUrl = siteUrlFromHeaders(headersList);

  return {
    icons: {
      icon: '/icon.svg',
      apple: '/icon.svg',
    },
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_TITLE,
      template: '%s | Aivory',
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    verification: {
      google: '-X46S5bMyCLH8iqPOeCooGlLGvfl2X7soGY9MuaQqt4',
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: `${siteUrl}/`,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_TITLE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const siteUrl = siteUrlFromHeaders(headersList);
  const initialLanguage = siteUrl === 'https://aivory.uk' ? 'en' : 'id';

  return (
    <html lang={initialLanguage} className={`${manrope.variable} ${doto.variable} antialiased scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Doto:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XYJ0EDEYS8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XYJ0EDEYS8');
            `,
          }}
        />
      </head>
      <body className="bg-background text-white font-manrope antialiased overflow-x-hidden w-full" style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif' }}>
        <JsonLd data={buildSiteGraph(siteUrl)} />
        <LanguageProvider initialLanguage={initialLanguage}>
          <AiTrap />
          <CanaryLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
