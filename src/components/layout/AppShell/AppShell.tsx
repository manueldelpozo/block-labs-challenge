import { AppShell as MantineAppShell, Burger, Group, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation } from 'react-router';
import { TenantLogo } from '@/components/ui/TenantLogo';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import classes from './AppShell.module.css';

export function AppShell() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const showSettings = useFeatureFlag('showSettings');

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    ...(showSettings ? [{ label: 'Settings', path: '/settings', icon: '⚙️' }] : []),
  ];

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header className={classes.header}>
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link to="/" className={classes.logoContainer}>
            <TenantLogo />
          </Link>
        </Group>

        <Group className={classes.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color:
                  location.pathname === item.path
                    ? 'var(--mantine-color-primary-filled)'
                    : 'inherit',
                fontWeight: location.pathname === item.path ? 700 : 500,
                padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                borderRadius: 'var(--mantine-radius-sm)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            leftSection={<span>{item.icon}</span>}
            active={location.pathname === item.path}
            onClick={close}
          />
        ))}
      </MantineAppShell.Navbar>

      <MantineAppShell.Main style={{ backgroundColor: 'var(--bl-color-bg-subtle)' }}>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
