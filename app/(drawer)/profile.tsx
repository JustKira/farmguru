import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { ScreenContent } from '~/components/ScreenContent';
import { Text } from '~/tamagui.config';

export default function Profile() {
  return (
    <>
      <NavStackStyled options={{ title: 'Profile' }} />
      <Container>
        <ScreenContent path="app/(drawer)/index.tsx" title="Profile" />
        <Text>Hello</Text>
      </Container>
    </>
  );
}
