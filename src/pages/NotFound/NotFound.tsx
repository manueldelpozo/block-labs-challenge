import { Center, Stack, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router';
import { useI18n } from '@/hooks/useI18n';

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useI18n();

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
        <Title order={2}>{t('page.notFound.title')}</Title>
        <Text c="dimmed" size="md" style={{ maxWidth: 450 }}>
          {t('page.notFound.description')}
        </Text>
        <Button size="md" onClick={() => navigate('/')} mt="md">
          {t('page.notFound.returnHome')}
        </Button>
      </Stack>
    </Center>
  );
}
