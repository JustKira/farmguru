import React, { forwardRef, useImperativeHandle, useState, useMemo } from 'react';
import { Sheet, YStack } from 'tamagui';

import { Container } from '~/components/Container';
import { FieldsScoutPoints } from '~/lib/db/schemas';
import { Text } from '~/tamagui.config';

export type ScoutPointDetailsHandle = {
  openScoutPointDetails: (point: FieldsScoutPoints) => void;
  closeScoutPointDetails: () => void;
};

const ScoutEditForm = forwardRef<ScoutPointDetailsHandle>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<FieldsScoutPoints | undefined>(undefined);
  const snapPoints = useMemo(() => [82.5], []);

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
          <YStack>
            <Text size="$4">{selectedPoint?.category}</Text>
          </YStack>
        </Container>
      </Sheet.Frame>
    </Sheet>
  );
});

export default ScoutEditForm;
