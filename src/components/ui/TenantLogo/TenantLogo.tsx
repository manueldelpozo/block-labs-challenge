import { memo } from 'react';
import { Group, Text, ThemeIcon } from '@mantine/core';
import { useTenant } from '@/hooks/useTenant';

interface TenantLogoProps {
  size?: number;
}

export const TenantLogo = memo(function TenantLogo({ size = 28 }: TenantLogoProps) {
  const { tenant } = useTenant();

  const firstLetter = tenant.name ? tenant.name.charAt(0) : 'B';

  return (
    <Group gap="xs" align="center">
      <ThemeIcon size={size} radius="xl" variant="filled" aria-hidden="true">
        <span style={{ fontSize: size * 0.5, fontWeight: 'bold' }}>{firstLetter}</span>
      </ThemeIcon>
      <Text fw={700} size="md" c="primary" style={{ whiteSpace: 'nowrap' }}>
        {tenant.logo}
      </Text>
    </Group>
  );
});
