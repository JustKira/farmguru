import { useRouter } from 'expo-router';
import { Button, YStack } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { useAuth } from '~/lib/providers/auth-provider';
import { Text } from '~/tamagui.config';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  return (
    <>
      <NavStackStyled options={{ title: 'Profile' }} />

      <Container>
        <YStack flex={1} justifyContent="space-between">
          <Text size="$5">{user?.email}</Text>

          <Button
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}>
            Sign Out
          </Button>
        </YStack>
      </Container>
    </>
  );
}
