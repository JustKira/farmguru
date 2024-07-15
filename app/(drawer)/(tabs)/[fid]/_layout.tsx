import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Slot, Tabs, useGlobalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'tamagui';

import NavStackStyled from '~/components/NavStackStyled';
import useMobileBackHandler from '~/lib/hooks/useMobileBackHandler';
import { FieldSharedDataProvider } from '~/lib/providers/field-shared-data-provider';

export default function TabLayout() {
  const { fid } = useGlobalSearchParams();
  const router = useRouter();

  useMobileBackHandler(
    () => true,
    () => router.navigate('(drawer)')
  );

  return (
    <FieldSharedDataProvider fid={fid as string}>
      <>
        <NavStackStyled />
        <Slot />
      </>
    </FieldSharedDataProvider>
  );
}
