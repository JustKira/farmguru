import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Overlay } from 'react-native-maps';
import { H2, H3, XStack, YStack, ZStack } from 'tamagui';

import SharedMap from '~/components/(drawer)/(tabs)/[fid]/SharedMap';
import ConfiguredSheet from '~/components/(drawer)/(tabs)/[fid]/Sheet';
import TrendBlock from '~/components/(drawer)/(tabs)/[fid]/info/TrendBlock';
import NavStackStyled from '~/components/NavStackStyled';
import { Field, FieldDetail, FieldsMapInfo } from '~/lib/db/schemas';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { useLanguage } from '~/lib/providers/language-provider';

export default function Index() {
  const shared = useSharedFieldData();

  const field = shared.field as Field;
  const map = shared.map as FieldsMapInfo;
  const details = shared.details as FieldDetail;

  //   const mapRef = useRef<SharedMapRef>(null);

  const { t } = useTranslation();

  const { currentLanguage } = useLanguage();
  return (
    <ZStack fullscreen>
      <NavStackStyled />
      <SharedMap>
        {map.defaultOverlayImgPath && field.bounds ? (
          <Overlay bounds={field.bounds} image={{ uri: map.defaultOverlayImgPath }} />
        ) : (
          <></>
        )}
      </SharedMap>

      <ConfiguredSheet screen="INFO">
        <YStack gap="$4">
          <H3>{t('weekly_change')}</H3>
          <XStack justifyContent="space-between" gap="$2">
            <TrendBlock label={t('nutrients')} value={Number(details?.nutrientsTrend ?? 0)} />
            <TrendBlock
              label={t('stress')}
              value={Number(details?.stressTrend ?? 0)}
              isNegativeNature
            />
          </XStack>

          <XStack justifyContent="space-between" gap="$2">
            <TrendBlock label={t('growth')} value={Number(details?.growthTrend ?? 0)} />

            <XStack flex={1} opacity={0}>
              <TrendBlock
                label={t('stress')}
                value={Number(details?.stressTrend ?? 0)}
                isNegativeNature
              />
            </XStack>

            {/* <TrendBlock label={t('growth')} value={Number(details?.growthTrend ?? 0)} /> */}
          </XStack>
        </YStack>
      </ConfiguredSheet>
    </ZStack>
  );
}
