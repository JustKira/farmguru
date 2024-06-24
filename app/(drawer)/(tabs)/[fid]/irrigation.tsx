import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Overlay } from 'react-native-maps';
import { Button, XStack, YStack, ZStack, useTheme } from 'tamagui';

import { SharedMap } from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import AddIrrigationForm, {
  IrrigationFormHandle,
} from '~/components/(drawer)/(tabs)/[fid]/irrigation/AddIrrigationForm';
import InfoCard from '~/components/(drawer)/(tabs)/[fid]/irrigation/InfoCard';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { Text } from '~/tamagui.config';

export default function Irrigation() {
  const shared = useSharedFieldData();

  const theme = useTheme();

  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;
  const details = shared.details as FieldDetail;

  const irrigationFormRef = useRef<IrrigationFormHandle>(null);

  const { t } = useTranslation();

  return (
    <>
      <ZStack fullscreen>
        <NavStackStyled />
        <SharedMap>
          {map.irrigationOverlayImgPath && field.bounds ? (
            <Overlay bounds={field.bounds} image={{ uri: map.irrigationOverlayImgPath }} />
          ) : (
            <></>
          )}
        </SharedMap>

        <ConfiguredSheet screen="IRRIGATION">
          <YStack>
            <YStack flex={1} gap="$6">
              <Text size="$8">{t('water_field_status')}</Text>
              <XStack flex={1} justifyContent="space-between" alignItems="flex-start">
                <InfoCard
                  label={t('dash.irr.soil_moisture_root_zone')}
                  icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                  value={`${details.soilMoisture}%`}
                />
                <InfoCard
                  label={t('days_to_wilting')}
                  icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                  value={`${details.daysToWilting} ${t('global.days')}`}
                />
              </XStack>
            </YStack>
            <YStack flex={1} gap="$6">
              <XStack justifyContent="space-between" alignItems="flex-start">
                <Text size="$8">{t('nav.irrigation')}</Text>
                <Button
                  onPress={() => {
                    irrigationFormRef.current?.openIrrigationForm();
                  }}>
                  {`${t('actions.add')}${t('nav.irrigation')}`}
                </Button>
              </XStack>
              <XStack flex={1} justifyContent="space-between" alignItems="flex-start">
                <InfoCard
                  label={t('next_irrigation')}
                  icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                  value={`${details.nextIrrigation} ${t('global.days')}`}
                />
                <InfoCard
                  label={t('advised_irrigation_duration')}
                  icon={<MaterialIcons name="water-drop" size={32} color={theme.primary.get()} />}
                  value={`${details.advisedWater} ${t('global.hours')}`}
                />
              </XStack>
            </YStack>
          </YStack>
        </ConfiguredSheet>
      </ZStack>
      <AddIrrigationForm fid={field.id as string} ref={irrigationFormRef} />
    </>
  );
}
