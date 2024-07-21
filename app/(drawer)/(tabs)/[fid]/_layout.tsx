import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'tamagui';
import useMobileBackHandler from '~/lib/hooks/useMobileBackHandler';

import { FieldSharedDataProvider } from '~/lib/providers/field-shared-data-provider';

export default function TabLayout() {
  const { fid } = useGlobalSearchParams();
  const router = useRouter();

  useMobileBackHandler(
    () => true,
    () => router.navigate('(drawer)')
  );
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <FieldSharedDataProvider fid={fid as string}>
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.background.get(),
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },

          tabBarStyle: {
            height: 60,
            backgroundColor: theme.background.get(),
            borderWidth: 0,
            shadowColor: 'transparent',
            borderBlockColor: 'transparent',
          },
          tabBarActiveTintColor: theme.primary.get(),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('nav.general'),
            tabBarIcon: ({ color }) => <Ionicons name="analytics-sharp" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="crop"
          options={{
            title: t('nav.crop'),
            tabBarIcon: ({ color }) => <FontAwesome5 name="seedling" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="irrigation"
          options={{
            title: t('nav.irrigation'),
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="water" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scout"
          options={{
            title: t('nav.scout'),
            tabBarIcon: ({ color }) => <FontAwesome name="search" size={30} color={color} />,
          }}
        />
      </Tabs>
    </FieldSharedDataProvider>
  );
}
