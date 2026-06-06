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
import {
  COLOR_SCHEME_OPTIONS,
  COLOR_SCHEME_OPTIONS_LIST,
  COLOR_SCHEME_BADGE_COLORS,
  COLOR_SCHEME_DISPLAY_LABELS,
  type TColorSchemeValue,
} from '@/theme/color-schemes';

interface IProfileFormValues {
  name: string;
  email: string;
  bio: string;
}

export function Profile() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme(COLOR_SCHEME_OPTIONS.light.value);

  const form = useForm<IProfileFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      bio: 'Frontend engineer exploring data analytics.',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Please enter a valid email address',
      bio: (value) => (value.length > 200 ? 'Bio must be under 200 characters' : null),
    },
  });

  const handleSave = useCallback((values: IProfileFormValues) => {
    console.log('Saved profile:', values);
  }, []);

  return (
    <PageContainer
      title="User Profile"
      description="Manage your appearance preferences and personal information."
    >
      <Stack gap="xl">
        {/* ── Appearance Section ─────────────────────────────── */}
        <Paper withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={3}>Appearance</Title>
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
              Color scheme
            </Text>
            <Text size="xs" c="dimmed">
              Choose your preferred color scheme. Auto follows your system settings.
            </Text>
            <SegmentedControl
              value={computedColorScheme}
              onChange={(value) => setColorScheme(value as TColorSchemeValue)}
              data={COLOR_SCHEME_OPTIONS_LIST}
              fullWidth
            />
          </Stack>
        </Paper>

        {/* ── Profile Information Section ────────────────────── */}
        <Paper withBorder p="md" radius="md">
          <form onSubmit={form.onSubmit(handleSave)}>
            <Stack gap="md">
              <Title order={3}>Profile Information</Title>
              <Divider />

              <TextInput
                withAsterisk
                label="Full name"
                description="Your display name across the platform"
                placeholder="Enter your full name"
                key={form.key('name')}
                {...form.getInputProps('name')}
              />

              <TextInput
                withAsterisk
                label="Email address"
                description="Used for notifications and account recovery"
                placeholder="Enter your email"
                key={form.key('email')}
                {...form.getInputProps('email')}
              />

              <Textarea
                label="Bio"
                description="A short description about yourself (max 200 characters)"
                placeholder="Tell us a bit about yourself"
                autosize
                minRows={3}
                maxRows={6}
                key={form.key('bio')}
                {...form.getInputProps('bio')}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Save Changes</Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </PageContainer>
  );
}
