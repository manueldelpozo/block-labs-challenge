import { memo } from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';

interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback = memo(function LoadingFallback({
  message = 'Loading page content...',
}: LoadingFallbackProps) {
  return (
    <Center style={{ minHeight: '50vh', width: '100%' }}>
      <Stack align="center" gap="xs">
        <Loader size="lg" />
        {message && (
          <Text size="sm" c="dimmed" fw={500}>
            {message}
          </Text>
        )}
      </Stack>
    </Center>
  );
});
