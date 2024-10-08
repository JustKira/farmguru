import { FontAwesome } from '@expo/vector-icons';
import * as IP from 'expo-image-picker';
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Sheet, YStack, useTheme } from 'tamagui';

import useMobileBackHandler from '~/lib/hooks/useMobileBackHandler';

export type ImagePickerSheetHandle = {
  openImagePickerSheet: () => void;
  closeImagePickerSheet: () => void;
  getImageUri: () => string | null;
};

type ImagePickerSheetProps = {
  children?: React.ReactNode;
  value?: string;
  onImageSelected?: (uri: string) => void;
};

const ImagePickerSheet = forwardRef<ImagePickerSheetHandle, ImagePickerSheetProps>(
  ({ children, onImageSelected, value }, ref) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(value ?? null);
    useMobileBackHandler(
      () => {
        if (open) {
          return true;
        }
        return false;
      },
      () => setOpen(false)
    );
    useEffect(() => {
      setImageUri(value ?? null);
    }, [value]);

    const openCamera = async () => {
      const permissionResult = await IP.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your camera!");
        return;
      }
      const result = await IP.launchCameraAsync();
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onImageSelected?.(uri); // Call the callback function
      }
    };

    const pickImage = async () => {
      const result = await IP.launchImageLibraryAsync({
        mediaTypes: IP.MediaTypeOptions.All,
        quality: 1,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onImageSelected?.(uri); // Call the callback function
      }
    };

    useImperativeHandle(ref, () => ({
      openImagePickerSheet: () => setOpen(true),
      closeImagePickerSheet: () => setOpen(false),
      getImageUri: () => imageUri,
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
          <YStack fullscreen justifyContent="center">
            <Button
              backgroundColor="$foregroundMuted"
              color="$background"
              onPress={openCamera}
              icon={() => <FontAwesome name="camera" size={20} color={theme.foreground.get()} />}>
              Open Camera
            </Button>
            <Button
              backgroundColor="$foregroundMuted"
              color="$background"
              onPress={pickImage}
              icon={() => <FontAwesome name="image" size={20} color={theme.foreground.get()} />}
              marginTop="$2">
              Open Gallery
            </Button>
            {imageUri && (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text>Selected Image:</Text>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 200, height: 200, marginTop: 10 }}
                />
              </View>
            )}
            {children}
            <Button
              backgroundColor="$foregroundMuted"
              color="$background"
              onPress={() => setOpen(false)}
              marginTop="$2">
              Close
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  }
);

export default ImagePickerSheet;
