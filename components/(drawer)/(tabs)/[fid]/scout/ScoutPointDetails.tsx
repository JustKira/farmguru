import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { date } from 'drizzle-orm/mysql-core';
import { Image } from 'expo-image';
import React, { forwardRef, useImperativeHandle, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { Button, Paragraph, ScrollView, Sheet, XStack, YStack, useTheme } from 'tamagui';

import ScoutInsertForm, { ScoutInsertFormHandle } from './ScoutInsertForm';

import { Container } from '~/components/Container';
import MapSheet, { MapSheetHandle } from '~/components/general/MapSheet';
import PreviewImageSheet, { PreviewImageSheetHandle } from '~/components/general/PreviewImageSheet';
import { Field, FieldsScoutPoints } from '~/lib/db/schemas';
import { useAudioPlayer } from '~/lib/hooks/useAudioPLayer';
import useMobileBackHandler from '~/lib/hooks/useMobileBackHandler';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { useLanguage } from '~/lib/providers/language-provider';
import { Text } from '~/tamagui.config';
import { Severity } from '~/types/global.types';
import { useCategories } from '~/utils/categories';
import getSeverity from '~/utils/get-severity';
import { localizedDateFormate } from '~/utils/localizedDateFormate';

export type ScoutPointDetailsHandle = {
  openScoutPointDetails: (point: FieldsScoutPoints) => void;
  closeScoutPointDetails: () => void;
};

const ScoutPointDetails = forwardRef<ScoutPointDetailsHandle>((props, ref) => {
  const [open, setOpen] = useState(false);
  const shared = useSharedFieldData();
  const field = shared.field as Field;
  const scoutInsertFormRef = useRef<ScoutInsertFormHandle>(null);
  const [selectedPoint, setSelectedPoint] = useState<FieldsScoutPoints | undefined>(undefined);
  const snapPoints = useMemo(() => [82.5], []);
  const theme = useTheme();
  const previewImageSheetRef = useRef<PreviewImageSheetHandle>(null);

  const handleOpenPreview = () => {
    const imageUri = selectedPoint?.photosFiles?.[0] ?? '';
    previewImageSheetRef.current?.openPreviewImageSheet(imageUri);
  };

  const { currentLanguage } = useLanguage();
  const mapSheetRef = useRef<MapSheetHandle>(null);
  const voiceNotePlayer = useAudioPlayer(selectedPoint?.voiceNoteFile ?? undefined);
  const voiceReplyPlayer = useAudioPlayer(selectedPoint?.voiceReplyFile ?? undefined);
  const handleOpenMap = () => {
    mapSheetRef.current?.openMapSheet();
  };

  const { t } = useTranslation();

  const severityColor = useMemo(() => {
    return selectedPoint?.severity.toLocaleLowerCase()
      ? getSeverity(selectedPoint.severity.toLocaleLowerCase() as Severity, {
          late: () => theme.red10.get(),
          moderate: () => theme.orange10.get(),
          early: () => theme.yellow10.get(),
        })
      : theme.yellow10.get();
  }, [selectedPoint, theme]);

  const categories = useCategories({
    color: severityColor,
  });

  useMobileBackHandler(
    () => {
      if (open) {
        return true;
      }
      return false;
    },
    () => setOpen(false)
  );

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) =>
        category.value.toLocaleLowerCase() === selectedPoint?.category.toLocaleLowerCase()
    );
  }, [selectedPoint, categories]);

  useImperativeHandle(ref, () => ({
    openScoutPointDetails: (point: FieldsScoutPoints) => {
      setSelectedPoint(point);
      setOpen(true);
    },
    closeScoutPointDetails: () => {
      setOpen(false);
    },
  }));

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode="percent"
        modal
        dismissOnOverlayPress
        dismissOnSnapToBottom
        zIndex={100_000}>
        <Sheet.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          style={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame>
          <Container>
            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  if (selectedPoint) {
                    scoutInsertFormRef.current?.openScoutUpdateForm(
                      {
                        category: selectedPoint.category.toLocaleLowerCase(),
                        severity: selectedPoint.severity.toLocaleLowerCase(),
                        createdOn: selectedPoint.date.toISOString(),
                        location: selectedPoint.location,
                        notes: selectedPoint.notes ?? undefined,
                        photoUri: selectedPoint.photosFiles?.[0] ?? undefined,
                        voiceNoteUri: selectedPoint.voiceNoteFile ?? undefined,
                      },
                      selectedPoint.id
                    );
                  }
                }}>
                <Text size="$6" color="$primary">
                  {t('actions.edit')}
                </Text>
              </TouchableOpacity>
              <YStack gap="$4">
                <YStack gap="$2">
                  <Text size="$4" color="$foregroundMuted">
                    {t('category')}
                  </Text>
                  <XStack alignItems="center" gap="$4">
                    {selectedCategory?.icon()}
                    {/* 
                    @ts-ignore */}
                    <Text size="$8">{t(selectedCategory?.value)}</Text>
                  </XStack>
                </YStack>
                <YStack gap="$2">
                  <Text size="$4" color="$foregroundMuted">
                    {t('severity')}
                  </Text>
                  <XStack alignItems="center" gap="$4">
                    <Text size="$8" color={severityColor}>
                      {selectedPoint?.severity
                        ? //@ts-ignore
                          capitalizeFirstLetter(t(selectedPoint.severity.toLocaleLowerCase()))
                        : t('unknown')}
                    </Text>
                  </XStack>
                </YStack>

                <YStack gap="$2">
                  <Text size="$4" color="$foregroundMuted">
                    {t('notes')}
                  </Text>
                  <XStack alignItems="center" gap="$4">
                    <Paragraph>
                      {selectedPoint?.notes
                        ? selectedPoint.notes
                        : t('no_available', { name: t('notes') })}
                    </Paragraph>
                  </XStack>
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    {t('voice_note')}
                  </Text>

                  {selectedPoint?.voiceNoteFile ? (
                    <Button
                      backgroundColor="$foregroundMuted"
                      color="$background"
                      onPress={() => {
                        voiceNotePlayer.togglePlay();
                      }}
                      icon={
                        <MaterialCommunityIcons
                          name={voiceNotePlayer.isPlaying ? 'speaker-off' : 'speaker'}
                          size={20}
                        />
                      }>
                      {voiceNotePlayer.isPlaying ? t('stop') : t('play')}
                    </Button>
                  ) : (
                    <Text size="$4"> {t('no_available', { name: t('voice_note') })}</Text>
                  )}
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    {t('image')}
                  </Text>
                  {selectedPoint?.photosFiles?.[0] ? (
                    <Button
                      backgroundColor="$foregroundMuted"
                      color="$background"
                      onPress={handleOpenPreview}>
                      {t('open_image')}
                    </Button>
                  ) : (
                    <Text size="$4">{t('no_available', { name: t('image') })}</Text>
                  )}

                  <PreviewImageSheet ref={previewImageSheetRef} />
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    {t('date')}
                  </Text>
                  <Text size="$4">
                    {selectedPoint?.date.toLocaleString()
                      ? localizedDateFormate(
                          selectedPoint.date,
                          'EE ,d MMM yyy HH:mm aaa',
                          currentLanguage
                        )
                      : t('unknown')}
                  </Text>
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    {t('location')}
                  </Text>
                  <YStack gap="$2">
                    <XStack gap="$4">
                      <Text size="$2">Lat - {selectedPoint?.location[0].toFixed(4)}</Text>
                      <Text size="$2">Lng - {selectedPoint?.location[1].toFixed(4)}</Text>
                    </XStack>
                    <Button
                      backgroundColor="$foregroundMuted"
                      color="$background"
                      onPress={() => {
                        handleOpenMap();
                      }}>
                      {t('open_map')}
                    </Button>
                  </YStack>
                </YStack>

                <YStack gap="$4">
                  {/* <Text size="$6" color="$foregroundMuted">
                    {t("expert_response")}
                  </Text> */}
                  <YStack>
                    <Text size="$4" color="$foregroundMuted">
                      {' '}
                      {t('expert_voice_response')}
                    </Text>

                    {selectedPoint?.voiceReplyFile ? (
                      <Button
                        backgroundColor="$foregroundMuted"
                        color="$background"
                        onPress={() => {
                          voiceReplyPlayer.togglePlay();
                        }}
                        icon={
                          <MaterialCommunityIcons
                            name={voiceReplyPlayer.isPlaying ? 'speaker-off' : 'speaker'}
                            size={20}
                          />
                        }>
                        {voiceReplyPlayer.isPlaying ? t('stop') : t('play')}
                      </Button>
                    ) : (
                      <Text size="$4">
                        {t('no_available', { name: t('expert_voice_response') })}
                      </Text>
                    )}
                  </YStack>

                  <YStack gap="$2">
                    <Text size="$4" color="$foregroundMuted">
                      {t('expert_response')}
                    </Text>
                    <XStack alignItems="center" gap="$4">
                      <Paragraph>
                        {selectedPoint?.reply
                          ? selectedPoint.reply
                          : t('no_available', { name: t('expert_response') })}
                      </Paragraph>
                    </XStack>
                  </YStack>
                </YStack>
              </YStack>
            </ScrollView>
          </Container>
        </Sheet.Frame>
      </Sheet>
      <MapSheet ref={mapSheetRef}>
        {selectedPoint ? (
          <Marker
            key={selectedPoint.id}
            coordinate={{
              latitude: selectedPoint.location[0],
              longitude: selectedPoint.location[1],
            }}
          />
        ) : (
          <></>
        )}
      </MapSheet>
      <ScoutInsertForm fid={field.id} ref={scoutInsertFormRef} />
    </>
  );
});

export default ScoutPointDetails;

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
