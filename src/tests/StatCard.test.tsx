import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { StatCard } from '@/components/ui/StatCard';
import { describe, it, expect } from 'vitest';

describe('StatCard', () => {
  it('renders standard metric card labels and values correctly', () => {
    render(
      <MantineProvider>
        <StatCard label="Total Revenue" value="$128,430" />
      </MantineProvider>,
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$128,430')).toBeInTheDocument();
  });

  it('renders trend percentages and indicators matching positive directions', () => {
    render(
      <MantineProvider>
        <StatCard label="Conversion" value="3.5%" trend={{ value: 12.5, isPositive: true }} />
      </MantineProvider>,
    );

    const trendEl = screen.getByLabelText('Increased by');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveTextContent('↑ 12.5%');
  });

  it('renders negative trend direction styling correctly', () => {
    render(
      <MantineProvider>
        <StatCard label="Conversion" value="1.2%" trend={{ value: 2.1, isPositive: false }} />
      </MantineProvider>,
    );

    const trendEl = screen.getByLabelText('Decreased by');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveTextContent('↓ 2.1%');
  });
});
