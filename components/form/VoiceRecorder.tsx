import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Stack, Text, YStack, useTheme } from 'tamagui';

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
  const { t } = useTranslation();
  const handleError = (error: Error) => {
    console.error('Recording failed:', error);
  };

  const theme = useTheme();

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
          backgroundColor="$foregroundMuted"
          color="$background"
          icon={
            <FontAwesome
              style={{
                marginRight: 10,
              }}
              color={theme.background.get()}
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
          {isRecording ? t('stop') : t('record')}
        </Button>
        {uri ? (
          <YStack marginTop="$0.5">
            <TouchableOpacity
              onPress={() => {
                voiceReplyPlayer.togglePlay();
              }}>
              <YStack paddingVertical="$2">
                <Text fontSize={16} color="$primary">
                  {voiceReplyPlayer.isPlaying ? t('stop') : t('play')}
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
