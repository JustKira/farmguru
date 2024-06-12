import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useEffect, useState } from 'react';

import LoginEndpoint from '../endpoints/login';

import { UserData } from '~/types/global.types';

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  authenticate: (
    email: string,
    password: string
  ) => Promise<{
    authenticated: boolean;
  }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{
  children: JSX.Element;
}> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserData | null>(null);

  const getUser = useQuery({
    queryKey: ['user-auth'],
    queryFn: () => AsyncStorage.getItem('user'),
    retry: false,
  });

  const authenticateMutation = useMutation({
    mutationKey: ['mut-user-auth'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      LoginEndpoint(email, password),
    onSuccess: async (data) => {
      await AsyncStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      console.log('User', data);
      getUser.refetch();
    },
    onError: (error) => {
      console.error('Error', error);
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['mut-user-logout'],
    mutationFn: () => AsyncStorage.removeItem('user'),
    onSuccess: async () => {
      setUser(null);

      queryClient.clear();
    },
    onError: (error) => {
      console.error('Error', error);
    },
  });

  useEffect(() => {
    if (getUser.data) {
      setUser(JSON.parse(getUser.data));
    }
  }, [getUser.data]);

  const authenticate = async (email: string, password: string) => {
    const res = await authenticateMutation.mutateAsync({ email, password });
    return res.loginId ? { authenticated: true } : { authenticated: false };
  };

  const signOut = async () => {
    await logoutMutation.mutateAsync();
  };

  const value = { user, authenticate, signOut, loading: getUser.isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
