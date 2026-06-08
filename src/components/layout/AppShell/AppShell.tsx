import { AppShell as MantineAppShell, Burger, Group, NavLink, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation } from 'react-router';
import { TenantLogo } from '@/components/ui/TenantLogo';
import { useTenant } from '@/hooks/useTenant';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { useI18n } from '@/hooks/useI18n';
import { TENANT_REGISTRY } from '@/config/tenant.config';
import classes from './AppShell.module.css';

export function AppShell() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const { tenant, tenantId, switchTenant } = useTenant();
  const showSettings = useFeatureFlag('showSettings');
  const { t } = useI18n();

  const tenantOptions = Object.entries(TENANT_REGISTRY).map(([id, config]) => ({
    label: config.name,
    value: id,
  }));

  const navItems = [
    { label: t('nav.dashboard'), path: '/', icon: '📊' },
    { label: t('nav.deposit'), path: '/deposit', icon: '💰' },
    { label: t('nav.profile'), path: '/profile', icon: '👤' },
    ...(showSettings ? [{ label: t('nav.settings'), path: '/settings', icon: '⚙️' }] : []),
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
            <TenantLogo name={tenant.name} logo={tenant.logo} />
          </Link>
          <Select
            data={tenantOptions}
            value={tenantId}
            onChange={(value) => value && switchTenant(value)}
            size="xs"
            w={140}
          />
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
