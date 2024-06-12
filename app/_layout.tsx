import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme } from 'tamagui';

import config from '../tamagui.config';

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

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <NetInfoProvider>
        {/* <AuthProvider> */}
        <DatabaseProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Theme name="dark">{children}</Theme>
          </GestureHandlerRootView>
        </DatabaseProvider>
        {/* </AuthProvider> */}
      </NetInfoProvider>
    </ThemeProvider>
  );
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <TamaguiProvider config={config}>{children}</TamaguiProvider>;
};
