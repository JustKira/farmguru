import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Image } from 'react-native';
import { Button, Sheet, YStack } from 'tamagui';

import { Text } from '~/tamagui.config';

export type PreviewImageSheetHandle = {
  openPreviewImageSheet: (imageUri: string) => void;
  closePreviewImageSheet: () => void;
};

type PreviewImageSheetProps = {
  children?: React.ReactNode;
};

const PreviewImageSheet = forwardRef<PreviewImageSheetHandle, PreviewImageSheetProps>(
  ({ children }, ref) => {
    const [open, setOpen] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      openPreviewImageSheet: (uri: string) => {
        setImageUri(uri);
        setOpen(true);
      },
      closePreviewImageSheet: () => setOpen(false),
    }));

    return (
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[100]}
        modal
        disableDrag
        zIndex={100_000}>
        <Sheet.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          style={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame>
          <YStack fullscreen paddingHorizontal="$4" borderRadius="$4" paddingTop="$10">
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            ) : (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <Text>No Image</Text>
              </YStack>
            )}
            {children}
            <Button onPress={() => setOpen(false)}>Close</Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  }
);

export default PreviewImageSheet;
