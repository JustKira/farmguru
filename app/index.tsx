import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { YStack } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { useAuth } from '~/lib/providers/auth-provider';
import { useNetInfo } from '~/lib/providers/netinfo-provider';
import { Text } from '~/tamagui.config';

export default function SplashScreen() {
  const { checking, isConnected } = useNetInfo();
  const { user, loading } = useAuth();

  return (
    <>
      <NavStackStyled options={{ headerShown: false }} />
      <Container>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text size="$5">{checking || loading ? 'loading...' : ''}</Text>

          {checking || loading ? null : (
            <ConditionTree authenticated={!!user} connected={isConnected} />
          )}
        </YStack>
      </Container>
    </>
  );
}
const ConditionTree = ({
  authenticated,
  connected,
}: {
  authenticated: boolean;
  connected: boolean;
}) => {
  switch (`${authenticated}|${connected}`) {
    case 'true|true':
      return <Redirect href="(drawer)" />;
    case 'true|false':
      return <Redirect href="(drawer)" />;
    case 'false|true':
      return <Redirect href="login" />;
    case 'false|false':
      return <Text>connect to the internet, to login</Text>;
  }
};
