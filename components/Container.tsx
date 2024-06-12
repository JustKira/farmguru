import { YStack } from 'tamagui';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack flex={1} padding="$6" backgroundColor="$background">
      {children}
    </YStack>
  );
};
