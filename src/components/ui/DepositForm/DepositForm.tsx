import {
  Paper,
  Stack,
  Title,
  Text,
  Select,
  NumberInput,
  Button,
  Group,
  Divider,
} from '@mantine/core';
import type { UseFormReturnType, FormRulesRecord } from '@mantine/form';
import type { IDepositFormValues } from '@/hooks/useDepositForm';
import type { TCurrencyEntry, TCurrencyValue } from '@/config/deposit.config';

/* ── Props ─────────────────────────────────────────────── */

export interface IDepositFormProps {
  /** Display brand name for the heading */
  brandName: string;
  /** CTA button text */
  ctaCopy: string;
  /** Mantine theme color key for the CTA button */
  primaryColor: string;
  /** The Mantine form instance from useDepositForm */
  form: UseFormReturnType<
    IDepositFormValues,
    IDepositFormValues,
    FormRulesRecord<IDepositFormValues>
  >;
  /** Pre-computed currency options for the Select (filtered by tenant) */
  currencyData: { label: string; value: string }[];
  /** Pre-computed network options for the Select */
  networkData: { label: string; value: string }[];
  /** The currently selected currency entry (or null) */
  selectedCurrency: TCurrencyEntry | null;
  /** Whether all required fields are filled */
  isReady: boolean;
  /** Whether the form is currently submitting an async request */
  isSubmitting: boolean;
  /** Error message from submission (null if no error) */
  submitError: string | null;
  /** Currency change handler — resets network if invalid */
  onCurrencyChange: (value: TCurrencyValue | null) => void;
  /** Form submit callback */
  onSubmit: (values: IDepositFormValues) => void;
}

/* ── Component ─────────────────────────────────────────── */

export function DepositForm({
  brandName,
  ctaCopy,
  primaryColor,
  form,
  currencyData,
  networkData,
  selectedCurrency,
  isReady,
  isSubmitting,
  submitError,
  onCurrencyChange,
  onSubmit,
}: IDepositFormProps) {
  return (
    <Paper withBorder p="lg" radius="md" shadow="sm" style={{ maxWidth: 480 }}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          {/* ── Heading ──────────────────────────────────── */}
          <Title order={2}>{`Deposit to ${brandName}`}</Title>
          <Text size="sm" c="dimmed">
            Choose your currency, network, and amount to make a deposit.
          </Text>
          <Divider />

          {/* ── Currency Select ──────────────────────────── */}
          <Select
            label="Currency"
            placeholder="Select a currency"
            data={currencyData}
            searchable
            clearable
            {...form.getInputProps('currency')}
            onChange={(value) => {
              onCurrencyChange(value as TCurrencyValue | null);
            }}
          />

          {/* ── Network Select ───────────────────────────── */}
          <Select
            label="Network"
            placeholder={selectedCurrency ? 'Select a network' : 'Select a currency first'}
            data={networkData}
            disabled={!selectedCurrency}
            {...form.getInputProps('network')}
          />

          {/* ── Amount Input ─────────────────────────────── */}
          <NumberInput
            label="Amount"
            placeholder="0.00"
            decimalScale={8}
            allowNegative={false}
            thousandSeparator=","
            hideControls
            {...form.getInputProps('amount')}
          />

          {/* ── Min Deposit Hint ─────────────────────────── */}
          {selectedCurrency && (
            <Text size="xs" c="dimmed">
              Minimum deposit: {selectedCurrency.minDeposit} {selectedCurrency.value}
            </Text>
          )}

          {/* ── Submit Error ─────────────────────────────── */}
          {submitError && (
            <Text size="sm" c="red" role="alert">
              {submitError}
            </Text>
          )}

          {/* ── CTA Button ───────────────────────────────── */}
          <Group justify="flex-end" mt="sm">
            <Button
              type="submit"
              color={primaryColor}
              disabled={!isReady || isSubmitting}
              loading={isSubmitting}
              size="md"
              fullWidth
            >
              {ctaCopy}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
