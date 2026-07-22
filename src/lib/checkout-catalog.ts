/**
 * Customer-facing service descriptions + "what's included" feature lists for
 * the checkout order-summary popup. Copy is kept in sync with the /pricing
 * cards (PricingStepOne / PricingStepTwo) so the checkout never contradicts
 * what the customer saw before clicking through.
 */

import { PRODUCT_IDS } from '@/lib/pricing';

export interface CheckoutServiceInfo {
  /** One-line explanation of what the service is / who it's for. */
  description: string;
  /** Bullet list of what the purchase includes. */
  features: string[];
}

const CHECKOUT_SERVICE_INFO: Record<string, CheckoutServiceInfo> = {
  [PRODUCT_IDS.DEEP_DIAGNOSTIC]: {
    description:
      'Gain a clear understanding of how your organisation operates before making AI decisions.',
    features: [
      'Operational maturity assessment',
      'Business objective alignment',
      'Operational bottleneck analysis',
      'AI opportunity mapping',
      'Process and data readiness',
    ],
  },
  [PRODUCT_IDS.BLUEPRINT]: {
    description:
      'Transform operational insights into a practical blueprint for business transformation and governed AI deployment.',
    features: [
      'Operational transformation blueprint',
      'Future-state workflow architecture',
      'AI deployment strategy',
      'Integration recommendations',
      'Executive implementation framework',
    ],
  },
  [PRODUCT_IDS.FULL_STACK]: {
    description:
      'Everything required to move from operational assessment to a clear transformation strategy.',
    features: [
      'Business Operations Assessment',
      'Transformation Blueprint',
      'Transformation Roadmap',
      'AI opportunity prioritisation',
      'Executive implementation plan',
    ],
  },
  [PRODUCT_IDS.FOUNDATION]: {
    description:
      'For individuals and solo professionals deploying their first AI agent.',
    features: [
      '1,500 conversations/month',
      '1 active agent',
      '3 workflow build',
      'Telegram or Slack (choose one)',
      'Multilingual by default',
    ],
  },
  [PRODUCT_IDS.PRO]: {
    description: 'For growing teams running AI operations daily.',
    features: [
      '5,000 conversations/month',
      '3 active agents',
      '7 workflow build',
      'Telegram + Slack + Email',
      'Multilingual by default',
      'Conditional logic & branching',
      'Multi-step agent flows',
    ],
  },
  [PRODUCT_IDS.ENTERPRISE]: {
    description: 'For organizations scaling AI across operations.',
    features: [
      'Unlimited conversations',
      'Unlimited agents',
      'Unlimited workflow build',
      'All channels + WhatsApp Business',
      'Custom integrations',
      'Advanced orchestration',
      'Multi-team workspace',
      'Dedicated support + SLA guarantee',
    ],
  },
};

/** Resolve service copy for a product id (handles `credits_<n>` packs too). */
export function getServiceInfo(id: string): CheckoutServiceInfo | undefined {
  if (id?.startsWith('credits_')) {
    const credits = parseInt(id.slice('credits_'.length), 10);
    if (!Number.isNaN(credits)) {
      return {
        description: `A one-time top-up of ${credits.toLocaleString(
          'en-US'
        )} Intelligence Credits, applied instantly to your workspace balance.`,
        features: [
          `${credits.toLocaleString('en-US')} Intelligence Credits`,
          'Never expires',
          'Usable across every agent and workflow',
        ],
      };
    }
  }
  return CHECKOUT_SERVICE_INFO[id];
}
