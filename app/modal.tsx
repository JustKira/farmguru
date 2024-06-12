import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Modal() {
  return (
    <>
      <Stack.Screen options={{ title: 'Modal', presentation: 'modal' }} />
      <ScreenContent path="app/modal.tsx" title="Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
