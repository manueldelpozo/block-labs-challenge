import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Center, Title, Text, Button, Paper, Stack } from '@mantine/core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Center style={{ minHeight: '100vh', padding: 'var(--mantine-spacing-xl)' }}>
          <Paper shadow="md" p="xl" radius="md" withBorder style={{ maxWidth: 500, width: '100%' }}>
            <Stack align="center" gap="md">
              <span style={{ fontSize: '3rem' }}>⚠️</span>
              <Title order={2} ta="center">
                Something went wrong
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                {this.state.error?.message || 'An unexpected runtime error occurred.'}
              </Text>
              <Button onClick={this.handleReset} fullWidth mt="md">
                Try again
              </Button>
            </Stack>
          </Paper>
        </Center>
      );
    }

    return this.props.children;
  }
}
