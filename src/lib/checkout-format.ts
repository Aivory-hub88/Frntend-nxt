/**
 * Currency + price formatting for the checkout flow.
 *
 * The IDR conversion mirrors the /pricing page exactly (live spot rate from
 * LanguageContext × a 5% margin) so the amount a customer is charged at
 * checkout matches the amount advertised on the pricing cards.
 */

export type CheckoutCurrency = 'IDR' | 'USD';

/** The exact integer amount charged, in the active currency's smallest sensible unit. */
export function checkoutAmount(
  priceUsd: number,
  currency: CheckoutCurrency,
  exchangeRate: number
): number {
  if (currency === 'USD') return priceUsd;
  // Same effective rate the pricing page uses (see PricingStepOne/Two).
  return Math.round(priceUsd * exchangeRate * 1.05);
}

/** A display string like `IDR 336.000` or `USD 20.00`. */
export function formatCheckoutPrice(
  priceUsd: number,
  currency: CheckoutCurrency,
  exchangeRate: number
): string {
  if (currency === 'USD') {
    return `USD ${priceUsd.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `IDR ${checkoutAmount(priceUsd, currency, exchangeRate).toLocaleString('id-ID')}`;
}
