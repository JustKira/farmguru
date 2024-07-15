import { useEffect } from 'react';

import { useAuth } from '~/lib/providers/auth-provider';

export default function AuthErrorScreen() {
  const auth = useAuth();

  useEffect(() => {
    auth.signOut();
  }, []);

  return <>Signing out...</>;
}
