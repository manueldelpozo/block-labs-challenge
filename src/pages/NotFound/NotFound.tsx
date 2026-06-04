import { Center, Stack, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Center style={{ minHeight: '80vh', padding: 'var(--mantine-spacing-xl)' }}>
      <Stack align="center" gap="md" ta="center">
        <Title
          order={1}
          style={{
            fontSize: '6rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--mantine-color-primary-filled)',
          }}
        >
          404
        </Title>
        <Title order={2}>Page Not Found</Title>
        <Text c="dimmed" size="md" style={{ maxWidth: 450 }}>
          The link you followed may be broken, or the page may have been moved or disabled for your
          tenant subscription.
        </Text>
        <Button size="md" onClick={() => navigate('/')} mt="md">
          Return to Dashboard
        </Button>
      </Stack>
    </Center>
  );
}
