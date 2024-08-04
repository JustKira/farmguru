import { zodResolver } from '@hookform/resolvers/zod';
import { useToastController } from '@tamagui/toast';
import { format } from 'date-fns';
import React, { forwardRef, useImperativeHandle, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input, ScrollView, Sheet, TextArea, YStack } from 'tamagui';
import { z } from 'zod';

import { DateTimeSelector } from '~/components/form/DateTimePicker';
import db from '~/lib/db';
import { FieldIrrigation, NewFieldIrrigation, fieldIrrigationSchema } from '~/lib/db/schemas';
import { useAuth } from '~/lib/providers/auth-provider';
import { useLanguage } from '~/lib/providers/language-provider';
import { useLoading } from '~/lib/providers/loading-provider';
import { useNetInfo } from '~/lib/providers/netinfo-provider';
import { synchronizeIrrigationInsert } from '~/lib/sync/synchronize-irrigation';
import { Text } from '~/tamagui.config';
import { localizedDateFormate } from '~/utils/localizedDateFormate';

const formSchema = z.object({
  duration: z.number().min(1, 'Duration should be at least 1 minute'),
  createdOn: z.string(),
});

export type IrrigationFormHandle = {
  openIrrigationForm: () => void;
  openIrrigationUpdateForm: (irrigation: z.infer<typeof formSchema>, id: string) => void;
};

const AddIrrigationForm = forwardRef<IrrigationFormHandle, { fid: string }>(({ fid }, ref) => {
  const [open, setOpen] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { startLoading, success, error, cancelLoading } = useLoading();
  const [countdown, setCountdown] = useState(0);
  const auth = useAuth();
  const snapPoints = useMemo(() => [82.5], []);
  const netinfo = useNetInfo();
  const toast = useToastController();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdOn: new Date().toISOString(),
    },
  });

  const { currentLanguage } = useLanguage();

  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    openIrrigationForm: () => {
      setOpen(true);
    },
    openIrrigationUpdateForm(irrigation, id) {
      Object.entries(irrigation).forEach(([key, value]) => {
        // @ts-ignore
        form.setValue(key, value);
      });
      setOpen(true);
    },
  }));

  const handleDateTimeChange = (event: any, mode: 'date' | 'time', selectedDate?: Date) => {
    const dateTime = new Date(form.watch('createdOn'));

    if (mode === 'date' && selectedDate) {
      const currentDate = new Date(
        dateTime.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );

      form.setValue('createdOn', currentDate.toISOString());
    } else if (mode === 'time' && selectedDate) {
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
    const dataToInsert: NewFieldIrrigation = {
      id: 'temp' + Math.random(),
      fieldId: fid,
      duration: data.duration,
      date: new Date(data.createdOn),
      createdOn: new Date(data.createdOn).toISOString(),
      lastUpdate: new Date().toISOString(),
    };

    console.log('Irrigation Data:', dataToInsert);

    try {
      startLoading();
      const res = await db.insert(fieldIrrigationSchema).values(dataToInsert).returning();
      const result = res[0] as FieldIrrigation;

      if (netinfo.isConnected) {
        await synchronizeIrrigationInsert(
          result,
          fid,
          //@ts-ignore
          auth.user
        );
        success('Irrigation saved.');
        // toast.show('You are Offline', {
        //   message: 'Irrigation saved locally and will be synced when online.',
        //   duration: 3000,
        // });
      } else {
        success('Irrigation saved locally and will be synced when online.');
        // toast.show('You are Offline', {
        //   message: 'Irrigation saved locally and will be synced when online.',
        //   duration: 3000,
        // });
      }

      setOpen(false);
      form.reset();
    } catch (e) {
      console.error('Error saving irrigation:', e);
      error('An error occurred while saving the irrigation. Please try again.');
      // toast.show('Error', {
      //   message: 'An error occurred while saving the irrigation. Please try again.',
      //   duration: 3000,
      // });
    }
  });

  return (
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
            <Text size="$6"> {`${t('actions.add')}${t('nav.irrigation')}`}</Text>
            <YStack gap="$2">
              <Text size="$2">
                {t('duration')} ({t('global.hours')})
              </Text>
              <Input
                size="$4"
                borderWidth={1}
                value={form.watch('duration') ? String(form.watch('duration')) : ''}
                onChangeText={(text) => form.setValue('duration', parseInt(text))}
                keyboardType="numeric"
              />
            </YStack>
            <YStack>
              <Text size="$2">{t('date')}</Text>
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
                  ? localizedDateFormate(
                      new Date(form.watch('createdOn')),
                      'EE ,d MMM yyy',
                      currentLanguage
                    )
                  : ''}
              </Text>
            </YStack>
            <YStack>
              <Text size="$2">{t('time')}</Text>
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
                  ? localizedDateFormate(
                      new Date(form.watch('createdOn')),
                      'HH:mm aaa',
                      currentLanguage
                    )
                  : ''}
              </Text>
            </YStack>
            <Button
              backgroundColor="$primary"
              color="$background"
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
              {cooldown ? `${t('save')} (${countdown})` : t('save')}
            </Button>
            <Button
              testID="cancel-button"
              backgroundColor="$foregroundMuted"
              color="$background"
              onPress={() => setOpen(false)}>
              {t('cancel')}
            </Button>
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
});

export default AddIrrigationForm;
