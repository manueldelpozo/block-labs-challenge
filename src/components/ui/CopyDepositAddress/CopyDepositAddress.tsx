import { Paper, Stack, Title, Text, Group, CopyButton, Button, Divider } from '@mantine/core';

export interface ICopyDepositAddressProps {
  /** The deposit address to display and copy */
  address: string;
  /** Brand name shown in the heading */
  brandName: string;
  /** Mantine theme color key for the copy button */
  primaryColor: string;
  /** Called when user clicks "Make another deposit" */
  onReset: () => void;
}

export function CopyDepositAddress({
  address,
  brandName,
  primaryColor,
  onReset,
}: ICopyDepositAddressProps) {
  return (
    <Paper withBorder p="lg" radius="md" shadow="sm" style={{ maxWidth: 480 }}>
      <Stack gap="md">
        <Title order={2}>{`Deposit to ${brandName}`}</Title>
        <Divider />

        <Title order={4}>Deposit Address</Title>
        <Text size="sm" c="dimmed">
          Send your funds to the following address:
        </Text>

        <Paper withBorder p="sm" radius="sm" bg="gray.0" style={{ wordBreak: 'break-all' }}>
          <Text component="code" size="sm" ff="monospace">
            {address}
          </Text>
        </Paper>

        <Group>
          <CopyButton value={address}>
            {({ copied, copy }) => (
              <Button color={primaryColor} onClick={copy}>
                {copied ? 'Copied!' : 'Copy Address'}
              </Button>
            )}
          </CopyButton>
          <Button variant="subtle" onClick={onReset}>
            Make another deposit
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
