import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'tamagui';

import { SynchronizerProvider } from '~/lib/providers/synchronizer-provider';

const DrawerLayout = () => {
  const theme = useTheme();

  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SynchronizerProvider>
        <Drawer
          screenOptions={{
            drawerActiveBackgroundColor: theme.muted.get(),
            drawerActiveTintColor: theme.primary.get(),
            drawerContentStyle: {
              backgroundColor: theme.background.get(),
            },
            drawerInactiveBackgroundColor: theme.background.get(),
            drawerInactiveTintColor: theme.foregroundMuted.get(),
            headerStyle: {
              backgroundColor: theme.background.get(),
            },
            headerTitleStyle: {
              color: theme.foreground.get(),
            },
            headerTintColor: theme.foreground.get(),
            headerShadowVisible: false,
          }}>
          <Drawer.Screen
            name="index"
            options={{
              headerTitle: t('navigation.home'),
              drawerLabel: t('navigation.home'),
              drawerIcon: ({ size, color }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              headerTitle: t('navigation.profile'),
              drawerLabel: t('navigation.profile'),
              drawerIcon: ({ size, color }) => (
                <MaterialIcons name="verified-user" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="(tabs)/[fid]"
            options={{
              headerTitle: t('navigation.field'),
              drawerItemStyle: { display: 'none' },
            }}
          />
        </Drawer>
      </SynchronizerProvider>
    </>
  );
};
export default DrawerLayout;
