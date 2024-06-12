import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { ScreenProps } from 'expo-router/build/useScreens';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from 'react-native-screens/lib/typescript/native-stack/types';
import { useTheme } from 'tamagui';

interface NavStackStyledProps
  extends ScreenProps<
    NativeStackNavigationOptions,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationEventMap
  > {}
export default function NavStackStyled({ options, ...props }: NavStackStyledProps) {
  const theme = useTheme();

  const mergedOptions: NativeStackNavigationOptions = {
    ...options,
    headerStyle: {
      backgroundColor: theme.background.get(),
    },

    headerTitleStyle: {
      color: theme.foreground.get(),
    },
  };

  //@ts-ignore
  return <Stack.Screen options={mergedOptions} {...props} />;
}
