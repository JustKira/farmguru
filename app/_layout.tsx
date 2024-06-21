import { ToastProvider } from '@tamagui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider, TamaguiProvider, Theme, YStack } from 'tamagui';

import migrations from '../drizzle/migrations';
import config, { Text } from '../tamagui.config';

import db from '~/lib/db';
import { AuthProvider } from '~/lib/providers/auth-provider';
import { NetInfoProvider } from '~/lib/providers/netinfo-provider';
import { CustomToast } from '~/components/Toast';
import { SafeToastViewport } from '~/components/ToastSafeView';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PortalProvider shouldAddRootHost>
          <MigratorWrapper>
            <QueryClientProvider client={queryClient}>
              <NetInfoProvider>
                <AuthProvider>
                  <Theme name={color}>
                    <ToastProvider>
                      {children}
                      <SafeToastViewport />
                      <CustomToast />
                    </ToastProvider>
                  </Theme>
                </AuthProvider>
              </NetInfoProvider>
            </QueryClientProvider>
          </MigratorWrapper>
        </PortalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
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
