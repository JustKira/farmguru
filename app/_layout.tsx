import { ToastProvider } from '@tamagui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme } from 'tamagui';

import config from '../tamagui.config';

import { AuthProvider } from '~/lib/providers/auth-provider';
import { DatabaseProvider } from '~/lib/providers/database-provider';
import { NetInfoProvider } from '~/lib/providers/netinfo-provider';

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
      <QueryClientProvider client={queryClient}>
        <NetInfoProvider>
          <DatabaseProvider>
            <AuthProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Theme name={color}>
                  <ToastProvider>{children}</ToastProvider>
                </Theme>
              </GestureHandlerRootView>
            </AuthProvider>
          </DatabaseProvider>
        </NetInfoProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>;
};
