import { useState } from 'react';
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
import { PageContainer } from '@/components/layout/PageContainer';
import { useTenant } from '@/hooks/useTenant';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export function Settings() {
  const { tenant, tenantId } = useTenant();
  const showAnalytics = useFeatureFlag('showAnalytics');
  const enableDarkMode = useFeatureFlag('enableDarkMode');
  const showBetaBanner = useFeatureFlag('showBetaBanner');

  const [username, setUsername] = useState('admin_user');
  const [emailNotify, setEmailNotify] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <PageContainer
      title="Settings"
      description="View and customize tenant environment variables, active features, and configuration profiles."
    >
      <Stack gap="xl">
        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={3}>Tenant Specifications</Title>
              <Badge variant="light" size="lg" color="indigo">
                {tenantId}
              </Badge>
            </Group>
            <Divider />
            <SimpleProperty label="Official Name" value={tenant.name} />
            <SimpleProperty label="Resolved Identifier" value={tenant.id} />
            <SimpleProperty label="Target API Endpoint" value={tenant.apiBase} />
            <SimpleProperty label="Configured Theme Font" value={tenant.theme.fontFamily} />
            <SimpleProperty
              label="Border Radius Spec"
              value={tenant.theme.borderRadius.toUpperCase()}
            />
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Title order={3}>Active Feature Envelopes</Title>
            <Divider />
            <FeatureStatusLabel label="Analytics Suite" active={showAnalytics} />
            <FeatureStatusLabel label="Tenant Settings Console" active={true} />
            <FeatureStatusLabel label="Native Dark Mode" active={enableDarkMode} />
            <FeatureStatusLabel label="Beta Banner Alerts" active={showBetaBanner} />
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Title order={3}>Interactive Configuration Simulator</Title>
            <Divider />
            <TextInput
              label="Simulation Admin Handle"
              description="Change local administrator name for this session"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
            <Switch
              label="Enable automated email dispatches"
              description="Simulate email alerts toggle state for configuration overrides"
              checked={emailNotify}
              onChange={(event) => setEmailNotify(event.currentTarget.checked)}
            />
            <Group justify="flex-end" mt="md">
              <Button onClick={handleSave} loading={isSaving}>
                Apply Overrides
              </Button>
            </Group>
          </Stack>
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
  return (
    <Group justify="space-between">
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Badge color={active ? 'green' : 'red'} variant="dot">
        {active ? 'Active' : 'Suspended'}
      </Badge>
    </Group>
  );
}
