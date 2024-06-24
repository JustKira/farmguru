import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { date } from 'drizzle-orm/mysql-core';
import { Image } from 'expo-image';
import React, { forwardRef, useImperativeHandle, useState, useMemo, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { Button, Paragraph, ScrollView, Sheet, XStack, YStack, useTheme } from 'tamagui';

import ScoutInsertForm, { ScoutInsertFormHandle } from './ScoutInsertForm';

import { Container } from '~/components/Container';
import MapSheet, { MapSheetHandle } from '~/components/general/MapSheet';
import PreviewImageSheet, { PreviewImageSheetHandle } from '~/components/general/PreviewImageSheet';
import { Field, FieldsScoutPoints } from '~/lib/db/schemas';
import { useAudioPlayer } from '~/lib/hooks/useAudioPLayer';
import { useSharedFieldData } from '~/lib/providers/field-shared-data-provider';
import { Text } from '~/tamagui.config';
import { Severity } from '~/types/global.types';
import { useCategories } from '~/utils/categories';
import getSeverity from '~/utils/get-severity';
import useMobileBackHandler from '~/lib/hooks/useMobileBackHandler';

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
  const mapSheetRef = useRef<MapSheetHandle>(null);
  const voiceNotePlayer = useAudioPlayer(selectedPoint?.voiceNoteFile ?? undefined);
  const voiceReplyPlayer = useAudioPlayer(selectedPoint?.voiceReplyFile ?? undefined);
  const handleOpenMap = () => {
    mapSheetRef.current?.openMapSheet();
  };

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
                  Edit
                </Text>
              </TouchableOpacity>
              <YStack gap="$4">
                <YStack gap="$2">
                  <Text size="$4" color="$foregroundMuted">
                    Category
                  </Text>
                  <XStack alignItems="center" gap="$4">
                    {selectedCategory?.icon()}
                    <Text size="$8">{selectedCategory?.value}</Text>
                  </XStack>
                </YStack>
                <YStack gap="$2">
                  <Text size="$4" color="$foregroundMuted">
                    Severity
                  </Text>
                  <XStack alignItems="center" gap="$4">
                    <Text size="$8" color={severityColor}>
                      {selectedPoint?.severity
                        ? capitalizeFirstLetter(selectedPoint.severity.toLocaleLowerCase())
                        : 'Unknown'}
                    </Text>
                  </XStack>
                </YStack>

                <YStack gap="$2">
                  <Text size="$4" color="$foregroundMuted">
                    Notes
                  </Text>
                  <XStack alignItems="center" gap="$4">
                    <Paragraph>
                      {selectedPoint?.notes ? selectedPoint.notes : 'No notes available'}
                    </Paragraph>
                  </XStack>
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    Voice
                  </Text>

                  {selectedPoint?.voiceNoteFile ? (
                    <Button
                      onPress={() => {
                        voiceNotePlayer.togglePlay();
                      }}
                      icon={
                        <MaterialCommunityIcons
                          name={voiceNotePlayer.isPlaying ? 'speaker-off' : 'speaker'}
                          size={20}
                        />
                      }>
                      {voiceNotePlayer.isPlaying ? 'Stop' : 'Play'}
                    </Button>
                  ) : (
                    <Text size="$4">no voice note found.</Text>
                  )}
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    Image
                  </Text>
                  {selectedPoint?.photosFiles?.[0] ? (
                    <Button onPress={handleOpenPreview}>Open Image Preview</Button>
                  ) : (
                    <Text size="$4">No image found</Text>
                  )}

                  <PreviewImageSheet ref={previewImageSheetRef} />
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    Date
                  </Text>
                  <Text size="$4">
                    {selectedPoint?.date.toLocaleString()
                      ? format(selectedPoint.date, 'EE ,d MMM yyy HH:mm aaa')
                      : 'Unknown'}
                  </Text>
                </YStack>

                <YStack>
                  <Text size="$4" color="$foregroundMuted">
                    Location
                  </Text>
                  <YStack gap="$2">
                    <XStack gap="$4">
                      <Text size="$2">Lat - {selectedPoint?.location[0].toFixed(4)}</Text>
                      <Text size="$2">Lng - {selectedPoint?.location[1].toFixed(4)}</Text>
                    </XStack>
                    <Button
                      onPress={() => {
                        handleOpenMap();
                      }}>
                      View on Map
                    </Button>
                  </YStack>
                </YStack>

                <YStack gap="$4">
                  <Text size="$6" color="$foregroundMuted">
                    Experts
                  </Text>
                  <YStack>
                    <Text size="$4">Voice Reply</Text>

                    {selectedPoint?.voiceReplyFile ? (
                      <Button
                        onPress={() => {
                          voiceReplyPlayer.togglePlay();
                        }}
                        icon={
                          <MaterialCommunityIcons
                            name={voiceReplyPlayer.isPlaying ? 'speaker-off' : 'speaker'}
                            size={20}
                          />
                        }>
                        {voiceReplyPlayer.isPlaying ? 'Stop' : 'Play'}
                      </Button>
                    ) : (
                      <Text size="$4">no voice reply found.</Text>
                    )}
                  </YStack>

                  <YStack gap="$2">
                    <Text size="$4" color="$foregroundMuted">
                      Reply
                    </Text>
                    <XStack alignItems="center" gap="$4">
                      <Paragraph>
                        {selectedPoint?.reply ? selectedPoint.reply : 'No reply available'}
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
