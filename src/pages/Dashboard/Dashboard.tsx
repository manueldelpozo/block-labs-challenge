import { useMemo } from 'react';
import { SimpleGrid, Alert, Paper, Title, Text, Stack, Loader, Center } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/ui/StatCard';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useData } from '@/hooks/useData';
import classes from './Dashboard.module.css';

interface IStatItem {
  label: string;
  value: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  icon: string;
}

export function Dashboard() {
  const showAnalytics = useFeatureFlag('showAnalytics');
  const showBetaBanner = useFeatureFlag('showBetaBanner');

  const statsFetcher = useMemo(() => {
    return async (signal?: AbortSignal) => {
      // Simulate network latency
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 600);
        signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });

      return [
        {
          label: 'Total Revenue',
          value: '$128,430',
          trend: { value: 12.5, isPositive: true },
          icon: '💰',
        },
        {
          label: 'Active Users',
          value: '8,642',
          trend: { value: 5.3, isPositive: true },
          icon: '👥',
        },
        {
          label: 'Conversion Rate',
          value: '3.24%',
          trend: { value: 0.8, isPositive: false },
          icon: '📈',
        },
        {
          label: 'Avg Response Time',
          value: '142ms',
          trend: { value: 15.2, isPositive: true }, // positive since lower is better
          icon: '⚡',
        },
      ];
    };
  }, []);

  const { data: stats, isLoading, error } = useData<IStatItem[]>(statsFetcher);

  return (
    <PageContainer
      title="Dashboard"
      description="Real-time multi-tenant platform performance metrics and business overview."
    >
      {showBetaBanner && (
        <Alert
          color="blue"
          title="Beta Feature Preview Enabled"
          variant="light"
          className={classes.betaBanner}
        >
          You are currently previewing a beta interface layout. Certain advanced reports are under
          development.
        </Alert>
      )}

      {isLoading && (
        <Center py="xl">
          <Loader size="md" />
        </Center>
      )}

      {error && (
        <Alert color="red" title="Error Loading Metrics">
          Unable to load dashboard performance data: {error.message}
        </Alert>
      )}

      {stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </SimpleGrid>
      )}

      {showAnalytics ? (
        <Paper className={classes.analyticsSection}>
          <Stack gap="md">
            <Title order={3}>Advanced Operations Analytics</Title>
            <Text c="dimmed" size="sm">
              Operational analytics visualization is enabled for your tenant. Below is a mock
              distribution graph.
            </Text>
            {/* Visual mock of graph */}
            <div
              style={{
                height: 180,
                backgroundColor: 'var(--bl-color-bg-subtle)',
                borderRadius: 'var(--mantine-radius-md)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: 'var(--mantine-spacing-md)',
                gap: 8,
                border: '1px solid var(--bl-color-border)',
              }}
            >
              {[40, 60, 45, 80, 55, 95, 70, 85, 110, 90, 130, 120].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${(h / 140) * 100}%`,
                    backgroundColor: 'var(--mantine-color-primary-filled)',
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.8 + (i % 3) * 0.1,
                  }}
                  title={`Value: ${h}`}
                />
              ))}
            </div>
          </Stack>
        </Paper>
      ) : (
        <Paper p="xl" mt="xl" style={{ borderStyle: 'dashed' }}>
          <Stack align="center" gap="sm">
            <Text c="dimmed" size="sm" ta="center">
              ⚠️ Advanced Operations Analytics is disabled for your tenant. Please contact support
              or upgrade your subscription to unlock charts.
            </Text>
          </Stack>
        </Paper>
      )}
    </PageContainer>
  );
}
