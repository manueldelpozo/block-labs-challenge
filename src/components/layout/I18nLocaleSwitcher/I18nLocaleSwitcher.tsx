import { Group, SegmentedControl, Text } from '@mantine/core';
import { useI18n } from '@/hooks/useI18n';

export function I18nLocaleSwitcher() {
  const { currentLocale, setLocale, supportedLocales } = useI18n();

  if (supportedLocales.length <= 1) {
    return null;
  }

  const localeData = supportedLocales.map((locale) => ({
    value: locale,
    label: locale === 'en-US' ? 'EN' : locale === 'ja-JP' ? 'JA' : locale,
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
