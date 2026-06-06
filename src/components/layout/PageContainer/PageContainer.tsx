import { type ReactNode } from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';

interface IPageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageContainer({ title, description, children }: IPageContainerProps) {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>{title}</Title>
          {description && (
            <Text c="dimmed" size="sm">
              {description}
            </Text>
          )}
        </Stack>
        {children}
      </Stack>
    </Container>
  );
}
