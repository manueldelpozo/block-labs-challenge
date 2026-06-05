import { memo } from 'react';
import { Group, Text, ThemeIcon } from '@mantine/core';

export interface TenantLogoProps {
  name: string;
  logo: string;
  size?: number;
}

export const TenantLogo = memo(function TenantLogo({ name, logo, size = 28 }: TenantLogoProps) {
  const firstLetter = name ? name.charAt(0) : 'B';

  return (
    <Group gap="xs" align="center">
      <ThemeIcon size={size} radius="xl" variant="filled" aria-hidden="true">
        <span style={{ fontSize: size * 0.5, fontWeight: 'bold' }}>{firstLetter}</span>
      </ThemeIcon>
      <Text fw={700} size="md" c="primary" style={{ whiteSpace: 'nowrap' }}>
        {logo}
      </Text>
    </Group>
  );
});
