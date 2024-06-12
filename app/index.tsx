import { ToastViewport, useToastController } from '@tamagui/toast';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { YStack, useTheme } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { useNetInfo } from '~/lib/providers/netinfo-provider';
import { Text } from '~/tamagui.config';

export default function SplashScreen() {
  const { checking, isConnected } = useNetInfo();
  // const { user } = useAuth();

  return (
    <>
      <NavStackStyled options={{ headerShown: false }} />
      <Container>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text size="$5">
            {checking ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
          </Text>
          {/* 
          {checking ? null : <ConditionTree authenticated={!!user} connected={isConnected} />} */}
        </YStack>
        <ToastViewport />
      </Container>
    </>
  );
}

// const ConditionTree = ({
//   authenticated,
//   connected,
// }: {
//   authenticated: boolean;
//   connected: boolean;
// }) => {
//   switch (`${authenticated}|${connected}`) {
//     case 'true|true':
//       return <Redirect href="(drawer)" />;

//     case 'true|false':
//       return <Redirect href="(drawer)" />;
//     case 'false|true':
//       return <Text>Please login</Text>;
//     case 'false|false':
//       return <Text>connect to the internet, to login</Text>;
//   }
// };
