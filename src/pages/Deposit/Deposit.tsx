import { useState, useEffect, useCallback } from 'react';
import { Center, Stack } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { DepositForm } from '@/components/ui/DepositForm';
import { CopyDepositAddress } from '@/components/ui/CopyDepositAddress';
import { useTenant } from '@/hooks/useTenant';
import { useI18n } from '@/hooks/useI18n';
import { useDepositForm } from '@/hooks/useDepositForm';
import { CURRENCY_OPTIONS_LIST } from '@/config/deposit.config';
import { fetchDepositAddress } from '@/services/deposit';
import type { IDepositFormValues } from '@/hooks/useDepositForm';

export function Deposit() {
  const { tenant, tenantId } = useTenant();
  const { t } = useI18n();

  const { form, selectedCurrency, availableNetworks, handleCurrencyChange, isReady } =
    useDepositForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);

  // Reset all form state when the tenant changes
  useEffect(() => {
    form.reset();
    setSubmitError(null);
    setDepositAddress(null);
    setIsSubmitting(false);
  }, [tenantId, form]);

  const currencyData = CURRENCY_OPTIONS_LIST.filter((c) =>
    tenant.i18n.supportedCurrencies.includes(c.value),
  ).map((c) => ({
    label: `${c.label} — ${c.networks.map((n) => n.label).join(', ')}`,
    value: c.value,
  }));

  const networkData = availableNetworks.map((n) => ({ label: n.label, value: n.value }));

  const onSubmit = async (values: IDepositFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setDepositAddress(null);
    try {
      const address = await fetchDepositAddress(values.currency, values.network);
      setDepositAddress(address);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = useCallback(() => {
    setDepositAddress(null);
    setSubmitError(null);
    form.reset();
  }, [form]);

  return (
    <PageContainer title={t('page.deposit.title')}>
      <Center>
        <Stack gap="md" align="center">
          <DepositForm
            brandName={tenant.name}
            ctaCopy={tenant.ctaCopy}
            primaryColor={tenant.theme.primaryColor}
            form={form}
            currencyData={currencyData}
            networkData={networkData}
            selectedCurrency={selectedCurrency}
            isReady={isReady}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onCurrencyChange={handleCurrencyChange}
            onSubmit={onSubmit}
          />
          {depositAddress && (
            <CopyDepositAddress
              address={depositAddress}
              brandName={tenant.name}
              primaryColor={tenant.theme.primaryColor}
              onReset={handleResetForm}
            />
          )}
        </Stack>
      </Center>
    </PageContainer>
  );
}
