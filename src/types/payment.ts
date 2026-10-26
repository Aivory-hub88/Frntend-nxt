/**
 * Payment types shared by `src/lib/payment.ts` and the payment UI.
 */

/** How a purchase was paid: Midtrans Snap/Core, or a manually verified transfer. */
export type PaymentMethod = 'midtrans' | 'manual';

export interface PaymentConfig {
  snapshotPrice: number;
  blueprintPrice: number;
  fullStackPrice: number;
  operationalPrice: number;
  businessPrice: number;
  operationalAnnualPrice: number;
  businessAnnualPrice: number;
  /** Price (USD) keyed by credit-pack size. */
  creditPrices: Record<number, number>;
  products: {
    SNAPSHOT: string;
    BLUEPRINT: string;
    FULL_STACK: string;
    OPERATIONAL: string;
    BUSINESS: string;
    OPERATIONAL_ANNUAL: string;
    BUSINESS_ANNUAL: string;
  };
  /** Credit-pack sizes on sale. */
  credits: number[];
  paymentMethods: {
    MIDTRANS: 'midtrans';
    MANUAL: 'manual';
  };
}

/** What a payment listener receives about one checkout. */
export interface PaymentTransactionResult {
  /** Product id, or the credit-pack size for a credit purchase. */
  product: string | number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  order_id?: string;
  error?: string;
}

export interface PaymentResult {
  status: 'success' | 'pending' | 'failure';
  result: PaymentTransactionResult;
}
