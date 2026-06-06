import { type ReactNode } from 'react';
import { Paper, Text, Group, ThemeIcon, Stack } from '@mantine/core';
import classes from './StatCard.module.css';

interface IStatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
}

export function StatCard({ label, value, trend, icon }: IStatCardProps) {
  return (
    <Paper
      radius="md"
      withBorder
      className={classes.card}
      role="region"
      aria-label={`${label} metric`}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            {label}
          </Text>
          {icon && (
            <ThemeIcon size="md" radius="md" variant="light" color="gray">
              {icon}
            </ThemeIcon>
          )}
        </Group>

        <Text className={classes.value}>{value}</Text>

        {trend && (
          <Group gap="xs" align="center">
            <span
              className={trend.isPositive ? classes.trendPositive : classes.trendNegative}
              aria-label={trend.isPositive ? 'Increased by' : 'Decreased by'}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <Text size="xs" c="dimmed">
              vs last period
            </Text>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
