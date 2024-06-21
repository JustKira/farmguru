import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Stack, Text, YStack } from 'tamagui';

import VoiceRecorderControllerInput, {
  VoiceRecorderControllerInputHandle,
} from './VoiceRecorderController';

import { useAudioPlayer } from '~/lib/hooks/useAudioPLayer';

interface VoiceRecordProps {
  onRecordingComplete: (uri: string) => void;
  value?: string;
}

export default function VoiceRecord({ onRecordingComplete, value }: VoiceRecordProps) {
  const voiceRecorder = useRef<VoiceRecorderControllerInputHandle>(null);
  const [uri, setUri] = useState<string | undefined>(value);
  const [isRecording, setIsRecording] = useState(false);
  const voiceReplyPlayer = useAudioPlayer(uri);
  const handleError = (error: Error) => {
    console.error('Recording failed:', error);
  };

  useEffect(() => {
    setUri(value);
  }, [value]);

  return (
    <VoiceRecorderControllerInput
      ref={voiceRecorder}
      onRecordingComplete={(uri) => {
        onRecordingComplete(uri);
        setUri(uri);
      }}
      onRecordingError={handleError}>
      <Stack>
        <Button
          icon={
            <FontAwesome
              style={{
                marginRight: 10,
              }}
              name={isRecording ? 'microphone-slash' : 'microphone'}
              size={20}
            />
          }
          onPress={() => {
            if (isRecording) {
              voiceRecorder.current?.stopRecording();
              setIsRecording(false);
            } else {
              voiceRecorder.current?.startRecording();
              setIsRecording(true);
            }
          }}>
          {isRecording ? 'Stop' : 'Record'}
        </Button>
        {uri ? (
          <YStack marginTop="$0.5">
            <TouchableOpacity
              onPress={() => {
                voiceReplyPlayer.togglePlay();
              }}>
              <YStack paddingVertical="$2">
                <Text fontSize={16} color="$primary">
                  {voiceReplyPlayer.isPlaying ? 'Stop' : 'Play'}
                </Text>
              </YStack>
            </TouchableOpacity>
          </YStack>
        ) : (
          <></>
        )}
      </Stack>
    </VoiceRecorderControllerInput>
  );
}
