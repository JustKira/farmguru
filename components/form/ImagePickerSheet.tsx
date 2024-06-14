import { FontAwesome } from '@expo/vector-icons';
import * as IP from 'expo-image-picker';
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Sheet, YStack, useTheme } from 'tamagui';

export type ImagePickerSheetHandle = {
  openImagePickerSheet: () => void;
  closeImagePickerSheet: () => void;
  getImageUri: () => string | null;
};

type ImagePickerSheetProps = {
  children?: React.ReactNode;
  onImageSelected?: (uri: string) => void;
};

const ImagePickerSheet = forwardRef<ImagePickerSheetHandle, ImagePickerSheetProps>(
  ({ children, onImageSelected }, ref) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

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
              onPress={openCamera}
              icon={() => <FontAwesome name="camera" size={20} color={theme.foreground.get()} />}>
              Open Camera
            </Button>
            <Button
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
            <Button onPress={() => setOpen(false)} marginTop="$2">
              Close
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    );
  }
);

export default ImagePickerSheet;
