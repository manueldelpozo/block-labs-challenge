import { useCallback, useMemo } from 'react';
import { useForm, type UseFormReturnType, type FormRulesRecord } from '@mantine/form';
import {
  CURRENCY_OPTIONS,
  type TCurrencyValue,
  type TCurrencyEntry,
  type TNetworkEntry,
} from '@/config/deposit.config';

/* ── Form value shape ──────────────────────────────────── */

export interface IDepositFormValues {
  currency: TCurrencyValue | '';
  network: string;
  amount: string;
}

/* ── Hook return type ──────────────────────────────────── */

export interface IUseDepositFormReturn {
  /** The Mantine form instance, fully typed */
  form: UseFormReturnType<
    IDepositFormValues,
    IDepositFormValues,
    FormRulesRecord<IDepositFormValues>
  >;
  /** The currently selected currency entry (or null if none selected) */
  selectedCurrency: TCurrencyEntry | null;
  /** The list of networks available for the selected currency */
  availableNetworks: TNetworkEntry[];
  /** Wrapped submit handler */
  handleSubmit: (onSubmit: (values: IDepositFormValues) => void) => (e?: React.SyntheticEvent<HTMLFormElement>) => void;
  /** Whether the form has all required fields filled */
  isReady: boolean;
}

/* ── Currency helper — safe lookup ─────────────────────── */

function lookupCurrency(key: string): TCurrencyEntry | null {
  if (!key || !(key in CURRENCY_OPTIONS)) return null;
  return CURRENCY_OPTIONS[key as keyof typeof CURRENCY_OPTIONS];
}

/* ── Hook ──────────────────────────────────────────────── */

export function useDepositForm(): IUseDepositFormReturn {
  const form = useForm<IDepositFormValues>({
    initialValues: {
      currency: '',
      network: '',
      amount: '',
    },
    validate: {
      currency: (value) => {
        if (!value) return 'Please select a currency';
        if (!lookupCurrency(value)) return 'Invalid currency selection';
        return null;
      },
      network: (value, values) => {
        if (!value) return 'Please select a network';
        const entry = lookupCurrency(values.currency);
        if (!entry) return 'Select a currency first';
        const validNetworks = entry.networks.map((n) => n.value) as string[];
        if (!validNetworks.includes(value)) return 'Invalid network for this currency';
        return null;
      },
      amount: (value, values) => {
        if (!value) return 'Please enter an amount';
        const num = Number(value);
        if (isNaN(num) || num <= 0) return 'Please enter a valid positive number';
        const entry = lookupCurrency(values.currency);
        if (!entry) return 'Select a currency first';
        if (num < entry.minDeposit) {
          return `Minimum deposit is ${entry.minDeposit} ${values.currency}`;
        }
        return null;
      },
    },
    onValuesChange: (values, previous) => {
      if (values.currency !== previous.currency) {
        const entry = lookupCurrency(values.currency);
        if (entry) {
          const validNetworks = entry.networks.map((n) => n.value) as string[];
          if (!validNetworks.includes(values.network)) {
            form.setFieldValue('network', '');
          }
        } else {
          form.setFieldValue('network', '');
        }
      }
    },
  });

  /* ── Reactive derived state (controlled mode) ──────────── */

  const values = form.getValues() ?? { currency: '', network: '', amount: '' };

  const selectedCurrency = useMemo<TCurrencyEntry | null>(
    () => lookupCurrency(values.currency),
    [values.currency],
  );

  const availableNetworks = useMemo<TNetworkEntry[]>(
    () => (selectedCurrency ? [...selectedCurrency.networks] : []),
    [selectedCurrency],
  );

  const isReady = values.currency !== '' && values.network !== '' && values.amount !== '';

  /* ── Submit handler wrapper ─────────────────────────────── */

  const handleSubmit = useCallback(
    (onSubmit: (values: IDepositFormValues) => void) => form.onSubmit(onSubmit),
    [form],
  );

  return {
    form,
    selectedCurrency,
    availableNetworks,
    handleSubmit,
    isReady,
  } as const;
}
