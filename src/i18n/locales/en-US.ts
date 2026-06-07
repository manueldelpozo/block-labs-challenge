import type { TTranslationMap } from '@/config/i18n.config';

export const enUS: TTranslationMap = {
  'nav.dashboard': 'Dashboard',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',

  'page.dashboard.title': 'Dashboard',
  'page.dashboard.description':
    'Real-time multi-tenant platform performance metrics and business overview.',
  'page.dashboard.betaBanner.title': 'Beta Feature Preview Enabled',
  'page.dashboard.betaBanner.message':
    'You are currently previewing a beta interface layout. Certain advanced reports are under development.',
  'page.dashboard.errorLoading': 'Error Loading Metrics',
  'page.dashboard.errorLoading.message': 'Unable to load dashboard performance data:',
  'page.dashboard.analytics.title': 'Advanced Operations Analytics',
  'page.dashboard.analytics.enabled':
    'Operational analytics visualization is enabled for your tenant. Below is a mock distribution graph.',
  'page.dashboard.analytics.disabled':
    '⚠️ Advanced Operations Analytics is disabled for your tenant. Please contact support or upgrade your subscription to unlock charts.',
  'page.dashboard.trendVsLastPeriod': 'vs last period',
  'page.dashboard.stat.totalRevenue': 'Total Revenue',
  'page.dashboard.stat.activeUsers': 'Active Users',
  'page.dashboard.stat.conversionRate': 'Conversion Rate',
  'page.dashboard.stat.avgResponseTime': 'Avg Response Time',

  'page.profile.title': 'User Profile',
  'page.profile.description': 'Manage your appearance preferences and personal information.',
  'page.profile.appearance': 'Appearance',
  'page.profile.colorScheme': 'Color scheme',
  'page.profile.colorSchemeDescription':
    'Choose your preferred color scheme. Auto follows your system settings.',
  'page.profile.profileInfo': 'Profile Information',
  'page.profile.fullName': 'Full name',
  'page.profile.fullNameDescription': 'Your display name across the platform',
  'page.profile.fullNamePlaceholder': 'Enter your full name',
  'page.profile.email': 'Email address',
  'page.profile.emailDescription': 'Used for notifications and account recovery',
  'page.profile.emailPlaceholder': 'Enter your email',
  'page.profile.bio': 'Bio',
  'page.profile.bioDescription': 'A short description about yourself (max 200 characters)',
  'page.profile.bioPlaceholder': 'Tell us a bit about yourself',
  'page.profile.saveChanges': 'Save Changes',

  'page.settings.title': 'Settings',
  'page.settings.description':
    'View and customize tenant environment variables, active features, and configuration profiles.',
  'page.settings.tenantSpecs': 'Tenant Specifications',
  'page.settings.activeFeatures': 'Active Feature Envelopes',
  'page.settings.simulator': 'Interactive Configuration Simulator',
  'page.settings.officialName': 'Official Name',
  'page.settings.resolvedId': 'Resolved Identifier',
  'page.settings.apiEndpoint': 'Target API Endpoint',
  'page.settings.themeFont': 'Configured Theme Font',
  'page.settings.borderRadius': 'Border Radius Spec',
  'page.settings.analyticsSuite': 'Analytics Suite',
  'page.settings.settingsConsole': 'Tenant Settings Console',
  'page.settings.darkMode': 'Native Dark Mode',
  'page.settings.betaBanner': 'Beta Banner Alerts',
  'page.settings.active': 'Active',
  'page.settings.suspended': 'Suspended',
  'page.settings.adminHandle': 'Simulation Admin Handle',
  'page.settings.adminHandleDescription': 'Change local administrator name for this session',
  'page.settings.adminHandlePlaceholder': 'Enter admin handle',
  'page.settings.emailDispatch': 'Enable automated email dispatches',
  'page.settings.emailDispatchDescription':
    'Simulate email alerts toggle state for configuration overrides',
  'page.settings.applyOverrides': 'Apply Overrides',

  'page.notFound.title': 'Page Not Found',
  'page.notFound.description':
    'The link you followed may be broken, or the page may have been moved or disabled for your tenant subscription.',
  'page.notFound.returnHome': 'Return to Dashboard',

  'common.trend.increase': 'Increased by',
  'common.trend.decrease': 'Decreased by',
};
