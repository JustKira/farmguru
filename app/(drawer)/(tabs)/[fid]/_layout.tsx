import { Slot, Tabs, useGlobalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from 'tamagui';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabBarIcon } from '~/components/TabBarIcon';
import { FieldSharedDataProvider } from '~/lib/providers/field-shared-data-provider';

export default function TabLayout() {
  const { fid } = useGlobalSearchParams();

  console.log('fidxx', fid);

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
            title: 'Info',
            tabBarIcon: ({ color }) => <Ionicons name="analytics-sharp" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="crop"
          options={{
            title: 'Crop',
            tabBarIcon: ({ color }) => <FontAwesome5 name="seedling" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="irrigation"
          options={{
            title: 'Irrigation',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="water" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scout"
          options={{
            title: 'Scout',
            tabBarIcon: ({ color }) => <FontAwesome name="search" size={30} color={color} />,
          }}
        />
      </Tabs>
    </FieldSharedDataProvider>
  );
}
