import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { ScreenContent } from '~/components/ScreenContent';
import { Text } from '~/tamagui.config';

export default function Home() {
  return (
    <>
      <NavStackStyled options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/(drawer)/index.tsx" title="Home" />
        <Text>Hello</Text>
      </Container>
    </>
  );
}
