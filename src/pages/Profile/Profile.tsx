import { useCallback } from 'react';
import {
  Paper,
  Stack,
  Group,
  Text,
  TextInput,
  Textarea,
  Button,
  Title,
  Divider,
  SegmentedControl,
  Badge,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/hooks/useI18n';
import {
  COLOR_SCHEME_OPTIONS,
  COLOR_SCHEME_OPTIONS_LIST,
  COLOR_SCHEME_BADGE_COLORS,
  COLOR_SCHEME_DISPLAY_LABELS,
  type TColorSchemeValue,
} from '@/theme/color-schemes';
import { I18nLocaleSwitcher } from '@/components/layout/I18nLocaleSwitcher/I18nLocaleSwitcher';

interface IProfileFormValues {
  name: string;
  email: string;
  bio: string;
}

export function Profile() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme(COLOR_SCHEME_OPTIONS.light.value);
  const { t } = useI18n();

  const form = useForm<IProfileFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      bio: 'Frontend engineer exploring data analytics.',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? t('page.profile.validation.nameTooShort') : null),
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : t('page.profile.validation.invalidEmail'),
      bio: (value) => (value.length > 200 ? t('page.profile.validation.bioTooLong') : null),
    },
  });

  const handleSave = useCallback((values: IProfileFormValues) => {
    console.log('Saved profile:', values);
  }, []);

  return (
    <PageContainer title={t('page.profile.title')} description={t('page.profile.description')}>
      <Stack gap="xl">
        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={3}>{t('page.profile.appearance')}</Title>
              <Badge
                variant="light"
                size="lg"
                color={COLOR_SCHEME_BADGE_COLORS[computedColorScheme]}
              >
                {COLOR_SCHEME_DISPLAY_LABELS[computedColorScheme]}
              </Badge>
            </Group>
            <Divider />
            <Text size="sm" fw={600}>
              {t('page.profile.colorScheme')}
            </Text>
            <Text size="xs" c="dimmed">
              {t('page.profile.colorSchemeDescription')}
            </Text>
            <SegmentedControl
              value={computedColorScheme}
              onChange={(value) => setColorScheme(value as TColorSchemeValue)}
              data={COLOR_SCHEME_OPTIONS_LIST}
              fullWidth
            />
            <Divider />
            <Text size="sm" fw={600}>
              Language
            </Text>
            <Text size="xs" c="dimmed">
              Choose your preferred language for the interface.
            </Text>
            <I18nLocaleSwitcher />
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <form onSubmit={form.onSubmit(handleSave)}>
            <Stack gap="md">
              <Title order={3}>{t('page.profile.profileInfo')}</Title>
              <Divider />

              <TextInput
                withAsterisk
                label={t('page.profile.fullName')}
                description={t('page.profile.fullNameDescription')}
                placeholder={t('page.profile.fullNamePlaceholder')}
                key={form.key('name')}
                {...form.getInputProps('name')}
              />

              <TextInput
                withAsterisk
                label={t('page.profile.email')}
                description={t('page.profile.emailDescription')}
                placeholder={t('page.profile.emailPlaceholder')}
                key={form.key('email')}
                {...form.getInputProps('email')}
              />

              <Textarea
                label={t('page.profile.bio')}
                description={t('page.profile.bioDescription')}
                placeholder={t('page.profile.bioPlaceholder')}
                autosize
                minRows={3}
                maxRows={6}
                key={form.key('bio')}
                {...form.getInputProps('bio')}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">{t('page.profile.saveChanges')}</Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </PageContainer>
  );
}
