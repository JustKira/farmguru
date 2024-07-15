// components/tabs/InfoTab.tsx
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Overlay } from 'react-native-maps';
import { H2, H3, useTheme, XStack, YStack } from 'tamagui';

import { MapLegend } from './[fid]/MapLegend';
import AddIrrigationForm, { IrrigationFormHandle } from './[fid]/irrigation/AddIrrigationForm';
import InfoCard from './[fid]/irrigation/InfoCard';

import TrendBlock from '~/components/(drawer)/(tabs)/[fid]/info/TrendBlock';
import { Button, Text } from '~/tamagui.config';
import { TabContent, TabContentProps } from '~/types/tabs.types';

export const IrrigationTab: TabContent = {
  map: {
    header: function Header({ t }) {
      return null;
    },
    overlays: function Overlays({ shared }) {
      const map = shared.map;
      const field = shared.field;
      if (!map || !field) return null;
      return (
        <>
          {map.irrigationOverlayImgPath && field.bounds ? (
            <Overlay bounds={field.bounds} image={{ uri: map.irrigationOverlayImgPath }} />
          ) : (
            <></>
          )}
        </>
      );
    },
  },
  sheet: {
    header: function Header({ shared, t }) {
      const field = shared.field;
      if (!field) return null;

      return (
        <MapLegend
          items={[
            { color: '#f9faff', name: t('very_low') },
            { color: '#aacfe9', name: t('low') },
            { color: '#3688c0', name: t('medium') },
            { color: '#09326a', name: t('high') },
          ]}
        />
      );
    },
    body: function Body(props) {
      return <IrrigationTabContent {...props} />;
    },
  },
  icon: function Icon(active: boolean) {
    const theme = useTheme();
    return (
      <Ionicons
        name="information-circle"
        size={24}
        color={active ? theme.primary.get() : '#8E8E93'}
      />
    );
  },
};

const IrrigationTabContent: React.FC<TabContentProps> = ({ shared, t }) => {
  const { details, field } = shared;
  const irrigationFormRef = useRef<IrrigationFormHandle>(null);
  const theme = useTheme();

  // Check for required data
  if (!details || !field) return null;

  // Render the irrigation information
  return (
    <>
      <YStack gap="$2">
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
              backgroundColor="$foregroundMuted"
              color="$background"
              onPress={() => {
                irrigationFormRef.current?.openIrrigationForm();
              }}>
              {`${t('actions.add')} ${t('nav.irrigation')}`}
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
      <AddIrrigationForm fid={field.id as string} ref={irrigationFormRef} />
    </>
  );
};

export default IrrigationTabContent;
