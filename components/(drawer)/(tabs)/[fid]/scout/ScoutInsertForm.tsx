import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToastController } from '@tamagui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import React, { forwardRef, useImperativeHandle, useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button, ScrollView, Sheet, TextArea, XStack, YStack } from 'tamagui';
import { z } from 'zod';

import { DateTimeSelector } from '~/components/form/DateTimePicker';
import { HorizontalButtons } from '~/components/form/HorizontalButtons';
import ImagePickerSheet, { ImagePickerSheetHandle } from '~/components/form/ImagePickerSheet';
import VoiceRecord from '~/components/form/VoiceRecorder';
import MapSheet, { MapSheetHandle } from '~/components/general/MapSheet';
import db from '~/lib/db';
import { FieldsScoutPoints, NewFieldsScoutPoints, fieldsScoutPointsSchema } from '~/lib/db/schemas';
import { useAuth } from '~/lib/providers/auth-provider';
import { useNetInfo } from '~/lib/providers/netinfo-provider';
import { synchronizeScoutPointInsertUpdate } from '~/lib/sync/synchronize-field-scout-points';
import { Text } from '~/tamagui.config';
const formSchema = z.object({
  category: z.string(),
  severity: z.string(),
  notes: z.string().optional(),
  createdOn: z.string(),
  location: z.tuple([z.number(), z.number()]),
  voiceNoteUri: z.string().optional(),
  photoUri: z.string().optional(),
});
export type ScoutInsertFormHandle = {
  openScoutPointForm: () => void;
  openScoutUpdateForm: (scoutPoint: z.infer<typeof formSchema>, id: string) => void;
};

const categoryItems = [
  {
    text: 'Insect',
    value: 'insect',
    icon: (color: string) => <FontAwesome name="bug" size={20} color={color} />,
  },
  {
    text: 'Disease',
    value: 'disease',
    icon: (color: string) => <FontAwesome5 name="virus" size={20} color={color} />,
  },
  {
    text: 'Growth',
    value: 'growth',
    icon: (color: string) => <Entypo name="leaf" size={20} color={color} />,
  },
  {
    text: 'Others',
    value: 'others',
    icon: (color: string) => <Entypo name="dots-three-horizontal" size={20} color={color} />,
  },
  {
    text: 'Dont Know',
    value: 'dont know',
    icon: (color: string) => <FontAwesome5 name="question" size={20} color={color} />,
  },
];

const severityItems = [
  {
    text: 'Early',
    value: 'early',
  },
  {
    text: 'Moderate',
    value: 'moderate',
  },
  {
    text: 'Late',
    value: 'late',
  },
];

const ScoutInsertForm = forwardRef<ScoutInsertFormHandle, { fid: string }>(({ fid }, ref) => {
  const [open, setOpen] = useState(false);
  const [pointId, setPointId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const snapPoints = useMemo(() => [82.5], []);
  const auth = useAuth();
  const mapSheetRef = useRef<MapSheetHandle>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdOn: new Date().toISOString(),
    },
  });

  const netinfo = useNetInfo();
  const toast = useToastController();
  const imagePickerSheetRef = useRef<ImagePickerSheetHandle>(null);
  const queryClient = useQueryClient();

  const handleImageSelected = (uri: string) => {
    console.log('Image selected:', uri);
    form.setValue('photoUri', uri);
  };

  useImperativeHandle(ref, () => ({
    openScoutPointForm: () => {
      setOpen(true);
    },
    openScoutUpdateForm(scoutPoint, id) {
      console.log('Scout Point:', scoutPoint);
      Object.entries(scoutPoint).forEach(([key, value]) => {
        if (key === 'photoUri' || key === 'voiceNoteUri') return;
        // @ts-ignore
        form.setValue(key, value);
      });
      setPointId(id);
      setIsUpdate(true);
      setOpen(true);
    },
  }));

  const handleDateTimeChange = (event: any, mode: 'date' | 'time', selectedDate?: Date) => {
    const dateTime = new Date(form.watch('createdOn'));

    if (mode === 'date' && selectedDate) {
      // Update only the date part, preserve the time

      const currentDate = new Date(
        dateTime.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );

      form.setValue('createdOn', currentDate.toISOString());
    } else if (mode === 'time' && selectedDate) {
      // Update only the time part, preserve the date
      const newTime = new Date(dateTime);
      newTime.setHours(selectedDate.getHours());
      newTime.setMinutes(selectedDate.getMinutes());
      form.setValue('createdOn', newTime.toISOString());
    }
  };

  const startCooldown = () => {
    setCooldown(true);
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    let result: FieldsScoutPoints | undefined;
    const dataToInsertOrUpdate: NewFieldsScoutPoints = {
      id: isUpdate && pointId ? pointId : 'temp' + Math.random(),
      fieldId: fid,
      date: new Date(data.createdOn),
      category: data.category,
      severity: data.severity,
      isNew: !isUpdate,
      isDirty: true,
      notes: data.notes,
      location: data.location,
      photosFiles: data.photoUri ? [data.photoUri] : [],
      lastUpdate: new Date(data.createdOn).toISOString(),
      voiceNoteFile: data.voiceNoteUri,
    };

    try {
      if (isUpdate && pointId) {
        const res = await db
          .update(fieldsScoutPointsSchema)
          .set(dataToInsertOrUpdate)
          .where(eq(fieldsScoutPointsSchema.id, pointId))
          .returning();
        if (res[0]) result = res[0] as FieldsScoutPoints;
      } else {
        const res = await db
          .insert(fieldsScoutPointsSchema)
          .values(dataToInsertOrUpdate)
          .returning();
        if (res[0]) result = res[0] as FieldsScoutPoints;
      }

      if (netinfo.isConnected && result) {
        await synchronizeScoutPointInsertUpdate(
          result,
          fid,
          //@ts-ignore
          auth.user,
          !isUpdate
        );
      } else {
        toast.show('You are Offline', {
          message: 'Scout point saved locally and will be synced when online.',
          duration: 3000,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ['field', 'scout', fid],
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error saving scout point:', error);
      toast.show('Error', {
        message: 'An error occurred while saving the scout point. Please try again.',
        duration: 3000,
      });
    }
  });

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
        <Sheet.Handle />
        <Sheet.Frame>
          <ScrollView>
            <YStack padding="$4" gap="$4">
              <YStack gap="$2">
                <Text size="$2">Category</Text>
                <HorizontalButtons
                  value={form.watch('category')}
                  items={categoryItems}
                  onClick={(v) => {
                    form.setValue('category', v);
                  }}
                />
              </YStack>
              <YStack gap="$2">
                <Text size="$2">Severity</Text>
                <HorizontalButtons
                  value={form.watch('severity')}
                  items={severityItems}
                  onClick={(v) => {
                    form.setValue('severity', v);
                  }}
                  square={false}
                />
              </YStack>
              <YStack gap="$2">
                <Text size="$2">Notes</Text>
                <TextArea
                  size="$4"
                  borderWidth={1}
                  textAlignVertical="top"
                  value={form.watch('notes')}
                  onChangeText={(text) => form.setValue('notes', text)}
                />
              </YStack>
              <YStack>
                <Text size="$2">Voice Note</Text>
                <VoiceRecord
                  // value={form.watch('voiceNoteUri')}
                  onRecordingComplete={(uri) => {
                    form.setValue('voiceNoteUri', uri);
                  }}
                />
              </YStack>
              <YStack gap="$2">
                <Text size="$2">Add Image</Text>
                <Button onPress={() => imagePickerSheetRef.current?.openImagePickerSheet()}>
                  {form.watch('photoUri') ? 'Image Selected' : 'Select Image'}
                </Button>
              </YStack>
              <YStack>
                <Text size="$2">Date</Text>
                <DateTimeSelector
                  mode="date"
                  onTimeChange={(e, d) => {
                    handleDateTimeChange(e, 'date', d);
                  }}
                  selectedDate={
                    form.watch('createdOn')
                      ? new Date(form.watch('createdOn')).toISOString()
                      : new Date().toISOString()
                  }
                />
                <Text size="$4" color="$foregroundMuted">
                  {form.watch('createdOn')
                    ? format(new Date(form.watch('createdOn')), 'EE ,d MMM yyy')
                    : ''}
                </Text>
              </YStack>
              <YStack>
                <Text size="$2">Time</Text>
                <DateTimeSelector
                  mode="time"
                  onTimeChange={(e, d) => {
                    handleDateTimeChange(e, 'time', d);
                  }}
                  selectedDate={
                    form.watch('createdOn')
                      ? new Date(form.watch('createdOn')).toISOString()
                      : new Date().toISOString()
                  }
                />
                <Text size="$4" color="$foregroundMuted">
                  {form.watch('createdOn')
                    ? format(new Date(form.watch('createdOn')), 'HH:mm aaa')
                    : ''}
                </Text>
              </YStack>
              <YStack>
                <Text size="$2">Location</Text>
                <Button
                  onPress={() => {
                    mapSheetRef.current?.openMapSheet();
                  }}>
                  Select Location
                </Button>
                <XStack gap="$4">
                  {form.watch('location') ? (
                    <>
                      <Text size="$2">Lat - {form.watch('location.0')?.toFixed(4)}</Text>
                      <Text size="$2">Lng - {form.watch('location.1')?.toFixed(4)}</Text>
                    </>
                  ) : (
                    <></>
                  )}
                </XStack>
              </YStack>

              <ImagePickerSheet
                ref={imagePickerSheetRef}
                onImageSelected={handleImageSelected}
                // value={form.watch('photoUri')}
              />
              <Button
                backgroundColor="$primary"
                color="black"
                disabled={cooldown}
                onPress={async () => {
                  await onSubmit();
                  const errors = Object.entries(form.formState.errors);
                  if (errors.length !== 0) {
                    const [key, error] = errors[0];
                    if (error?.message) {
                      toast.show(`Error`, {
                        message: `${key}: ${error.message}`,
                        duration: 3000,
                      });
                    }
                  }

                  startCooldown();
                }}>
                {cooldown ? `Save (${countdown})` : 'Save'}
              </Button>
              <Button onPress={() => setOpen(false)}>Cancel</Button>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
      <MapSheet
        ref={mapSheetRef}
        interactiveMarker
        singular
        onMarkerAdded={(location) => {
          form.setValue('location', [location.latitude, location.longitude]);
        }}
      />
      {/* <CustomToast />
      <SafeToastViewport /> */}
    </>
  );
});

export default ScoutInsertForm;
