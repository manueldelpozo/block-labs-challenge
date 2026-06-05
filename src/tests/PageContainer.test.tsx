import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { PageContainer } from '@/components/layout/PageContainer';
import { describe, it, expect } from 'vitest';

describe('PageContainer', () => {
  const renderContainer = (title: string, description?: string) => {
    return render(
      <MantineProvider>
        <PageContainer title={title} description={description}>
          <p>Child content</p>
        </PageContainer>
      </MantineProvider>,
    );
  };

  it('renders the page title', () => {
    renderContainer('Dashboard');
    expect(screen.getByRole('heading', { name: /dashboard/i, level: 1 })).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    renderContainer('Dashboard', 'Key performance metrics');
    expect(screen.getByText('Key performance metrics')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    renderContainer('Dashboard');
    expect(screen.queryByText('Key performance metrics')).not.toBeInTheDocument();
  });

  it('renders children', () => {
    renderContainer('Dashboard');
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
