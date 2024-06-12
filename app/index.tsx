import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';

import { Text } from '~/tamagui.config';

export default function SplashScreen() {
  return (
    <>
      <NavStackStyled options={{ headerShown: false }} />
      <Container>
        <Text>Loading...</Text>
      </Container>
    </>
  );
}
