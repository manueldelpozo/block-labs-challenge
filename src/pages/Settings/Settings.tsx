import { useCallback, useState } from 'react';
import {
  Paper,
  Stack,
  Group,
  Text,
  TextInput,
  Switch,
  Badge,
  Button,
  Title,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTenant } from '@/hooks/useTenant';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useI18n } from '@/hooks/useI18n';

interface ISettingsFormValues {
  username: string;
  emailNotify: boolean;
}

export function Settings() {
  const { tenant, tenantId } = useTenant();
  const showAnalytics = useFeatureFlag('showAnalytics');
  const enableDarkMode = useFeatureFlag('enableDarkMode');
  const showBetaBanner = useFeatureFlag('showBetaBanner');
  const { t } = useI18n();

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ISettingsFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      username: 'admin_user',
      emailNotify: true,
    },
    validate: {
      username: (value) =>
        value.trim().length < 3 ? t('page.settings.validation.handleTooShort') : null,
    },
  });

  const handleSave = useCallback((_values: ISettingsFormValues) => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  }, []);

  return (
    <PageContainer title={t('page.settings.title')} description={t('page.settings.description')}>
      <Stack gap="xl">
        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={3}>{t('page.settings.tenantSpecs')}</Title>
              <Badge variant="light" size="lg" color="indigo">
                {tenantId}
              </Badge>
            </Group>
            <Divider />
            <SimpleProperty label={t('page.settings.officialName')} value={tenant.name} />
            <SimpleProperty label={t('page.settings.resolvedId')} value={tenant.id} />
            <SimpleProperty label={t('page.settings.apiEndpoint')} value={tenant.apiBase} />
            <SimpleProperty label={t('page.settings.themeFont')} value={tenant.theme.fontFamily} />
            <SimpleProperty
              label={t('page.settings.borderRadius')}
              value={tenant.theme.borderRadius.toUpperCase()}
            />
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Title order={3}>{t('page.settings.activeFeatures')}</Title>
            <Divider />
            <FeatureStatusLabel label={t('page.settings.analyticsSuite')} active={showAnalytics} />
            <FeatureStatusLabel label={t('page.settings.settingsConsole')} active={true} />
            <FeatureStatusLabel label={t('page.settings.darkMode')} active={enableDarkMode} />
            <FeatureStatusLabel label={t('page.settings.betaBanner')} active={showBetaBanner} />
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <form onSubmit={form.onSubmit(handleSave)}>
            <Stack gap="md">
              <Title order={3}>{t('page.settings.simulator')}</Title>
              <Divider />
              <TextInput
                withAsterisk
                label={t('page.settings.adminHandle')}
                description={t('page.settings.adminHandleDescription')}
                placeholder={t('page.settings.adminHandlePlaceholder')}
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <Switch
                label={t('page.settings.emailDispatch')}
                description={t('page.settings.emailDispatchDescription')}
                key={form.key('emailNotify')}
                {...form.getInputProps('emailNotify', { type: 'checkbox' })}
              />
              <Group justify="flex-end" mt="md">
                <Button type="submit" loading={isSaving}>
                  {t('page.settings.applyOverrides')}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </PageContainer>
  );
}

function SimpleProperty({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Text size="sm" c="dimmed" style={{ wordBreak: 'break-all' }}>
        {value}
      </Text>
    </Group>
  );
}

function FeatureStatusLabel({ label, active }: { label: string; active: boolean }) {
  const { t } = useI18n();
  return (
    <Group justify="space-between">
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Badge color={active ? 'green' : 'red'} variant="dot">
        {active ? t('page.settings.active') : t('page.settings.suspended')}
      </Badge>
    </Group>
  );
}
