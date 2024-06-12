import { ToastProvider } from '@tamagui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme, YStack } from 'tamagui';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import config, { Text } from '../tamagui.config';

import { AuthProvider } from '~/lib/providers/auth-provider';

import { NetInfoProvider } from '~/lib/providers/netinfo-provider';
import db from '~/lib/db';

SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(drawer)',
// };

export default function RootLayout() {
  return (
    <Wrapper>
      <Stack />
    </Wrapper>
  );
}

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const color = useColorScheme();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   console.log(theme);
  //   NavigationBar.setBackgroundColorAsync(color === 'dark' ? '#000000' : '#ffffff');
  // }, [color]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MigratorWrapper>
          <QueryClientProvider client={queryClient}>
            <NetInfoProvider>
              <AuthProvider>
                <Theme name={color}>
                  <ToastProvider>{children}</ToastProvider>
                </Theme>
              </AuthProvider>
            </NetInfoProvider>
          </QueryClientProvider>
        </MigratorWrapper>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

const MigratorWrapper = ({ children }: { children: React.ReactNode }) => {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <YStack>
        <Text>Migration error: {error.message}</Text>
      </YStack>
    );
  }

  if (!success) {
    return (
      <YStack>
        <Text>Migration is in progress...</Text>
      </YStack>
    );
  }

  return <>{children}</>;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>;
};
