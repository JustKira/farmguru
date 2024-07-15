import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XStack, YStack, ZStack, Sheet, Button, Stack, Text, ScrollView } from 'tamagui';

import { CropTab } from '~/components/(drawer)/(tabs)/CropTab';
import { InfoTab } from '~/components/(drawer)/(tabs)/InfoTab';
import { IrrigationTab } from '~/components/(drawer)/(tabs)/IrrigationTab';
import ScoutTab from '~/components/(drawer)/(tabs)/ScoutTab';
import ScreenContent from '~/components/(drawer)/(tabs)/ScreenContent';
import SharedMap from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { TabContent, TabName } from '~/types/tabs.types';

const tabs: Record<TabName, TabContent> = {
  INFO: InfoTab,
  CROP: CropTab,
  IRRIGATION: IrrigationTab,
  SCOUT: ScoutTab,
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabName>('INFO');
  const shared = useSharedFieldData();
  const { t } = useTranslation();
  const { getState, setState } = useSharedState();

  const currentTab = tabs[activeTab];

  return (
    <ZStack fullscreen>
      <SharedMap>{currentTab.map.overlays({ shared, t, getState, setState })}</SharedMap>

      <YStack position="absolute" top={0} left={0} right={0} padding="$1">
        {currentTab.map.header({ shared, t, getState, setState })}
      </YStack>

      <Sheet
        // modal={false}
        zIndex={100_000}
        open
        snapPoints={[75, 40]}
        dismissOnSnapToBottom={false}>
        {currentTab.sheet.header({ shared, t, getState, setState }) ? (
          <YStack h="$6" flexDirection="column-reverse">
            {currentTab.sheet.header({ shared, t, getState, setState })}
          </YStack>
        ) : (
          <YStack h="$6" flexDirection="column-reverse">
            <Sheet.Handle />
          </YStack>
        )}

        <Sheet.Frame>
          {/* <YStack flex={1} padding="$2" backgroundColor={'$background'} borderRadius={'$4'}> */}
          <ScrollView mt="$4" px="$4">
            <ScreenContent screen={activeTab} />
            {currentTab.sheet.body({ shared, t, getState, setState })}
            <Stack mb="$20" />
          </ScrollView>
          {/* </YStack> */}
        </Sheet.Frame>
      </Sheet>

      <XStack
        position="absolute"
        zIndex={100_000_000}
        left={0}
        right={0}
        bottom={0}
        borderTopWidth={2}
        borderTopColor="$muted"
        justifyContent="space-around"
        backgroundColor="$background">
        {(Object.keys(tabs) as TabName[]).map((tabName) => (
          <Button
            key={tabName}
            onPress={() => setActiveTab(tabName)}
            flexDirection="column"
            alignItems="center"
            unstyled
            p="$4">
            {tabs[tabName].icon(activeTab === tabName)}
          </Button>
        ))}
      </XStack>
    </ZStack>
  );
}

function useSharedState() {
  const [state, setState] = useState<Record<string, any>>({});

  const getState = useCallback((key: string) => state[key], [state]);

  const setStateForKey = useCallback(
    (key: string, value: any) => setState((prev) => ({ ...prev, [key]: value })),
    []
  );

  return { state, getState, setState: setStateForKey };
}
