import { Group, SegmentedControl, Text } from '@mantine/core';
import { useI18n } from '@/hooks/useI18n';
import { LOCALE_LABELS } from '@/config/i18n.config';

export function I18nLocaleSwitcher() {
  const { currentLocale, setLocale, supportedLocales } = useI18n();

  if (supportedLocales.length <= 1) {
    return null;
  }

  const localeData = supportedLocales.map((locale) => ({
    value: locale,
    label: LOCALE_LABELS[locale] ?? locale,
  }));

  return (
    <Group gap="xs" align="center">
      <Text size="xs" c="dimmed">
        Lang:
      </Text>
      <SegmentedControl size="xs" value={currentLocale} onChange={setLocale} data={localeData} />
    </Group>
  );
}
