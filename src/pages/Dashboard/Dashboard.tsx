import { useMemo } from 'react';
import { SimpleGrid, Alert, Paper, Title, Text, Stack, Loader, Center } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/ui/StatCard';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useI18n } from '@/hooks/useI18n';
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
  const { t } = useI18n();

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
          label: 'page.dashboard.stat.totalRevenue',
          value: '$128,430',
          trend: { value: 12.5, isPositive: true },
          icon: '💰',
        },
        {
          label: 'page.dashboard.stat.activeUsers',
          value: '8,642',
          trend: { value: 5.3, isPositive: true },
          icon: '👥',
        },
        {
          label: 'page.dashboard.stat.conversionRate',
          value: '3.24%',
          trend: { value: 0.8, isPositive: false },
          icon: '📈',
        },
        {
          label: 'page.dashboard.stat.avgResponseTime',
          value: '142ms',
          trend: { value: 15.2, isPositive: true },
          icon: '⚡',
        },
      ];
    };
  }, []);

  const { data: stats, isLoading, error } = useData<IStatItem[]>(statsFetcher);

  return (
    <PageContainer title={t('page.dashboard.title')} description={t('page.dashboard.description')}>
      {showBetaBanner && (
        <Alert
          color="blue"
          title={t('page.dashboard.betaBanner.title')}
          variant="light"
          className={classes.betaBanner}
        >
          {t('page.dashboard.betaBanner.message')}
        </Alert>
      )}

      {isLoading && (
        <Center py="xl">
          <Loader size="md" />
        </Center>
      )}

      {error && (
        <Alert color="red" title={t('page.dashboard.errorLoading')}>
          {t('page.dashboard.errorLoading.message')} {error.message}
        </Alert>
      )}

      {stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={t(stat.label)}
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
            <Title order={3}>{t('page.dashboard.analytics.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('page.dashboard.analytics.enabled')}
            </Text>
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
              {t('page.dashboard.analytics.disabled')}
            </Text>
          </Stack>
        </Paper>
      )}
    </PageContainer>
  );
}
