import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, YStack } from 'tamagui';

import { Container } from '~/components/Container';
import NavStackStyled from '~/components/NavStackStyled';
import { useAuth } from '~/lib/providers/auth-provider';
import { useLanguage } from '~/lib/providers/language-provider';
import { Text } from '~/tamagui.config';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const { t } = useTranslation();
  const { changeLanguage, currentLanguage } = useLanguage();
  return (
    <>
      <NavStackStyled options={{ title: t('navigation.profile') }} />

      <Container>
        <YStack flex={1} justifyContent="space-between">
          <Text size="$5">{user?.email}</Text>

          <Button
            onPress={() => {
              changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar');
            }}>
            Change Language {currentLanguage === 'ar' ? 'English' : 'Arabic'}
          </Button>

          <Button
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}>
            {t('signout')}
          </Button>
        </YStack>
      </Container>
    </>
  );
}
