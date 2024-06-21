import { Audio } from 'expo-av';
import React, { useState, useImperativeHandle, forwardRef } from 'react';

export type VoiceRecorderControllerInputProps = {
  onRecordingComplete?: (uri: string) => void;
  onRecordingError?: (error: Error) => void;
  children: JSX.Element;
};

export type VoiceRecorderControllerInputHandle = {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
};

const VoiceRecorderControllerInput = forwardRef<
  VoiceRecorderControllerInputHandle,
  VoiceRecorderControllerInputProps
>(({ onRecordingComplete, onRecordingError, children }, ref) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useImperativeHandle(ref, () => ({
    startRecording: async () => {
      try {
        const permissionResponse = await Audio.requestPermissionsAsync();
        if (permissionResponse.status !== 'granted') {
          console.log('Audio recording permission not granted');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      } catch (err) {
        console.error('Failed to start recording', err);
        //@ts-expect-error
        onRecordingError?.(err);
      }
    },
    stopRecording: async () => {
      if (!recording) return;

      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at:', uri);
        //@ts-expect-error
        onRecordingComplete?.(uri);
        setRecording(null);
      } catch (err) {
        console.error('Error stopping the recording', err);
        //@ts-expect-error
        onRecordingError?.(err);
      }
    },
  }));

  return <>{children}</>;
});

export default VoiceRecorderControllerInput;
