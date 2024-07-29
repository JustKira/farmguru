import { ToastProvider } from '@tamagui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { getLocales, getCalendars } from 'expo-localization';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider, TamaguiProvider, Theme, YStack } from 'tamagui';

// import '../locales/en';
// import '../locales/ar';

import './i18n.ts';

import migrations from '../drizzle/migrations';
import config, { Text } from '../tamagui.config';

import { CustomToast } from '~/components/Toast';
import { SafeToastViewport } from '~/components/ToastSafeView';
import db from '~/lib/db';
import { AuthProvider } from '~/lib/providers/auth-provider';
import { LanguageProvider } from '~/lib/providers/language-provider';
import { LoadingProvider } from '~/lib/providers/loading-provider';
import { NetInfoProvider } from '~/lib/providers/netinfo-provider';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://0aa2490c387189fcb0fcbe94c96a89c2@o4507394079326208.ingest.de.sentry.io/4507684913021008',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(drawer)',
// };

function RootLayout() {
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
          <LanguageProvider>
            <MigratorWrapper>
              <QueryClientProvider client={queryClient}>
                <NetInfoProvider>
                  <AuthProvider>
                    <Theme name={color}>
                      <LoadingProvider>
                        <ToastProvider native>
                          {children}
                          <SafeToastViewport />
                          <CustomToast />
                        </ToastProvider>
                      </LoadingProvider>
                    </Theme>
                  </AuthProvider>
                </NetInfoProvider>
              </QueryClientProvider>
            </MigratorWrapper>
          </LanguageProvider>
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
    return <YStack></YStack>;
  }

  return <>{children}</>;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>;
};

export default Sentry.wrap(RootLayout);
