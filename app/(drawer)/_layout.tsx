import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from 'tamagui';

import { SynchronizerProvider } from '~/lib/providers/synchronizer-provider';

const DrawerLayout = () => {
  const theme = useTheme();

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
              headerTitle: 'Home',
              drawerLabel: 'Home',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              headerTitle: 'Profile',
              drawerLabel: 'Profile',
              drawerIcon: ({ size, color }) => (
                <MaterialIcons name="verified-user" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="[fid]"
            options={{
              headerTitle: 'Field',
              drawerItemStyle: { display: 'none' },
              // drawerIcon: ({ size, color }) => (
              //   <MaterialIcons name="border-bottom" size={size} color={color} />
              // ),
              // headerRight: () => (
              //   <Link href="/modal" asChild>
              //     <HeaderButton />
              //   </Link>
              // ),
            }}
          />
        </Drawer>
      </SynchronizerProvider>
    </>
  );
};
export default DrawerLayout;
