import type { Metadata } from 'next';
import { HeroSection } from '@/components/product/HeroSection';
import { FeaturedProduct } from '@/components/product/FeaturedProduct';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CTAFooter } from '@/components/product/CTAFooter';
import { getProductData } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Products — Aivory',
  description:
    'Discover AI-powered tools for business transformation: diagnostics, blueprints, workflow automation, and intelligent agents.',
};

const alignments: Array<'left' | 'right'> = ['left', 'right', 'left'];

export default function ProductPage() {
  const { featured, grid } = getProductData();

  return (
    <main>
      <HeroSection
        title="AI-Powered Business Transformation"
        subtitle="From diagnostic to deployment — everything you need to integrate AI into your business operations."
      />

      {featured.map((product, idx) => (
        <FeaturedProduct
          key={product.id}
          id={product.id}
          title={product.title}
          tagline={product.tagline}
          description={product.description}
          features={product.features}
          alignment={alignments[idx]}
        />
      ))}

      <ProductGrid sectionTitle="And much more" products={grid} />

      <CTAFooter
        title="Ready to transform your business with AI?"
        subtitle="Start with a free AI readiness diagnostic and discover your potential."
        primaryCta={{ label: 'Get Started Free', href: '/diagnostic' }}
        secondaryCta={{ label: 'Talk to Us', href: '/contact' }}
      />
    </main>
  );
}
