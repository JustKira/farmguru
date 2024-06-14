import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import React, { forwardRef, useImperativeHandle, useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button, ScrollView, Sheet, TextArea, XStack, YStack } from 'tamagui';
import { z } from 'zod';

import { DateTimeSelector } from '~/components/form/DateTimePicker';
import { HorizontalButtons } from '~/components/form/HorizontalButtons';
import ImagePickerSheet, { ImagePickerSheetHandle } from '~/components/form/ImagePickerSheet';
import MapSheet, { MapSheetHandle } from '~/components/general/MapSheet';
import { Text } from '~/tamagui.config';

export type ScoutInsertFormHandle = {
  openScoutPointForm: () => void;
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

const formSchema = z.object({
  category: z.string(),
  severity: z.string(),
  notes: z.string().optional(),
  createdOn: z.string(),
  location: z.tuple([z.number(), z.number()]),
  voiceNoteUri: z.string().optional(),
  photoUri: z.string().optional(),
});

const ScoutInsertForm = forwardRef<ScoutInsertFormHandle>((props, ref) => {
  const [open, setOpen] = useState(false);
  const snapPoints = useMemo(() => [82.5], []);
  const mapSheetRef = useRef<MapSheetHandle>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const imagePickerSheetRef = useRef<ImagePickerSheetHandle>(null);

  const handleImageSelected = (uri: string) => {
    console.log('Image selected:', uri);
    form.setValue('photoUri', uri);
  };

  useImperativeHandle(ref, () => ({
    openScoutPointForm: () => {
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
          <ScrollView>
            <YStack padding="$4" gap="$4">
              <YStack gap="$2">
                <Text size="$2">Category</Text>
                <HorizontalButtons
                  items={categoryItems}
                  onClick={(v) => {
                    form.setValue('category', v);
                  }}
                />
              </YStack>
              <YStack gap="$2">
                <Text size="$2">Severity</Text>
                <HorizontalButtons
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
                  onChangeText={(text) => form.setValue('notes', text)}
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

              <ImagePickerSheet ref={imagePickerSheetRef} onImageSelected={handleImageSelected} />
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
    </>
  );
});

export default ScoutInsertForm;
