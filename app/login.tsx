import { zodResolver } from '@hookform/resolvers/zod';
import { useToastController } from '@tamagui/toast';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { Button, H1, Input, Stack, YStack } from 'tamagui';
import * as z from 'zod';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { useAuth } from '~/lib/providers/auth-provider';
import { useLoading } from '~/lib/providers/loading-provider';
import { useNetInfo } from '~/lib/providers/netinfo-provider';
import { Text } from '~/tamagui.config';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { checking, isConnected } = useNetInfo();
  const { user, authenticate } = useAuth();
  const router = useRouter();

  const { t } = useTranslation();
  const { startLoading, success, error } = useLoading();

  const color = useColorScheme();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (checking) {
    }
  }, []);

  if (checking) return <Text>{t('messages.loading')}</Text>;

  if (isConnected === false && user === null) {
    return (
      <>
        <NavStackStyled options={{ headerShown: false }} />
        <Container>
          <Text>{t('no_connection_to_net')}</Text>
        </Container>
      </>
    );
  }
  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    startLoading();
    const res = await authenticate(data.email, data.password);

    if (res.authenticated) {
      success('Login Successful', () => {
        router.push('/(drawer)');
      });
    } else {
      error('Wrong email or password. Please try again.', () => {});
    }
    setLoading(false);
  });

  return (
    <>
      <NavStackStyled options={{ headerShown: false }} />
      <Container>
        <YStack flex={1} justifyContent="center" space="$4">
          <YStack justifyContent="flex-end" alignItems="flex-start" width="100%" h="$10">
            <Image
              source={
                color === 'dark'
                  ? require('~/assets/farmguru_white.svg')
                  : require('~/assets/farmguru.svg')
              }
              style={{
                width: '75%',
                height: '75%',
              }}
              alt="test"
              contentFit="cover"
            />
          </YStack>

          <YStack space="$2">
            <Text size="$4">{t('login.email')}</Text>
            <Controller
              control={form.control}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                />
              )}
              name="email"
            />
          </YStack>
          <YStack space="$2">
            <Text size="$4">{t('login.password')}</Text>
            <Controller
              control={form.control}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  testID="what-ever"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                />
              )}
              name="password"
            />
          </YStack>
          <Button backgroundColor="$foregroundMuted" color="$background" onPress={onSubmit}>
            {loading ? `${t('messages.loading')}` : `${t('login.signin')}`}
          </Button>
        </YStack>
      </Container>
    </>
  );
}
