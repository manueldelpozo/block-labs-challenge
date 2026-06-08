/**
 * Deposit currency and network options defined as a const object.
 *
 * Usage:
 *   - Direct access:  `CURRENCY_OPTIONS.ETH.minDeposit`
 *   - Data array:     `CURRENCY_OPTIONS_LIST` (for Select dropdown)
 *   - Derived types:  `TCurrencyKey` | `TCurrencyValue`
 *
 * Add or remove entries here and all consumers stay in sync.
 */

export const CURRENCY_OPTIONS = {
  BTC: {
    label: 'Bitcoin (BTC)',
    value: 'BTC',
    minDeposit: 0.001,
    networks: [{ label: 'Bitcoin', value: 'bitcoin' }],
  },
  ETH: {
    label: 'Ethereum (ETH)',
    value: 'ETH',
    minDeposit: 0.01,
    networks: [
      { label: 'Ethereum (ERC-20)', value: 'erc20' },
      { label: 'Arbitrum', value: 'arbitrum' },
      { label: 'Optimism', value: 'optimism' },
    ],
  },
  USDC: {
    label: 'USD Coin (USDC)',
    value: 'USDC',
    minDeposit: 10,
    networks: [
      { label: 'Ethereum (ERC-20)', value: 'erc20' },
      { label: 'Solana', value: 'solana' },
      { label: 'Polygon', value: 'polygon' },
    ],
  },
  SOL: {
    label: 'Solana (SOL)',
    value: 'SOL',
    minDeposit: 0.1,
    networks: [{ label: 'Solana', value: 'solana' }],
  },
} as const;

/* ── Derived types ─────────────────────────────────────── */

/** Union of object keys: `'BTC' | 'ETH' | 'USDC' | 'SOL'` */
export type TCurrencyKey = keyof typeof CURRENCY_OPTIONS;

/** Union of the `value` fields — derived, so always in sync */
export type TCurrencyValue = (typeof CURRENCY_OPTIONS)[TCurrencyKey]['value'];

/** Shape of a single currency entry */
export type TCurrencyEntry = (typeof CURRENCY_OPTIONS)[TCurrencyKey];

/** Shape of a network entry within a currency */
export type TNetworkEntry = (typeof CURRENCY_OPTIONS)[TCurrencyKey]['networks'][number];

/* ── Reusable data arrays ──────────────────────────────── */

/** Array of full currency entries for Select `data` prop filtering */
export const CURRENCY_OPTIONS_LIST = Object.values(CURRENCY_OPTIONS);

/** Flat value strings, e.g. for iterating or validation */
export const CURRENCY_VALUES = CURRENCY_OPTIONS_LIST.map((c) => c.value);
