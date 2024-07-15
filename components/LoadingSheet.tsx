import { FontAwesome } from '@expo/vector-icons';
import React, { FunctionComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import { YStack, Sheet, Text, useTheme } from 'tamagui';

type LoadingSheetProps = {
  visible: boolean;
  status: 'loading' | 'success' | 'error';
  message?: string;
};

export const LoadingSheet: FunctionComponent<LoadingSheetProps> = ({
  visible,
  status,
  message,
}) => {
  const theme = useTheme();

  const renderIcon = () => {
    switch (status) {
      case 'success':
        return <FontAwesome name="check-circle" size={60} color={theme.primary.get()} />;
      case 'error':
        return <FontAwesome name="crosshairs" size={60} color="red" />;
      default:
        return <ActivityIndicator size="large" color={theme.primary.get()} />;
    }
  };

  const getDefaultMessage = () => {
    switch (status) {
      case 'loading':
        return 'Loading...';
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error!';
    }
  };

  return (
    <Sheet modal open={visible} snapPoints={[95]}>
      <Sheet.Frame backgroundColor="$background" justifyContent="center" alignItems="center">
        <YStack space="$4" alignItems="center">
          {renderIcon()}
          <Text color={theme.primary.get()} textAlign="center">
            {message || getDefaultMessage()}
          </Text>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
