import { ToastViewport } from '@tamagui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeToastViewport = () => {
  const { left, top, right } = useSafeAreaInsets();
  return (
    <ToastViewport
      flexDirection="column-reverse"
      zIndex={100_000}
      top={top}
      left={left}
      right={right}
    />
  );
};

export { SafeToastViewport };
