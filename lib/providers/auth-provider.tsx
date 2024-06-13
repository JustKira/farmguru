import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useEffect, useState } from 'react';

import db from '../db';
import {
  fieldsDetailSchema,
  fieldsMapInfoSchema,
  fieldsSchema,
  fieldsScoutPointsSchema,
} from '../db/schemas';
import LoginEndpoint from '../endpoints/login';

import { UserData } from '~/types/global.types';

type AuthStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'LOGOUT';

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  status: AuthStatus;
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
  const [status, setStatus] = useState<AuthStatus>('LOADING');

  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserData | null>(null);

  const getUser = useQuery({
    queryKey: ['user-auth'],
    queryFn: async () => {
      const res = await AsyncStorage.getItem('user');

      if (res) {
        setStatus('AUTHENTICATED');
      } else {
        setStatus('UNAUTHENTICATED');
      }
      return res;
    },
    retry: false,
  });

  const authenticateMutation = useMutation({
    mutationKey: ['mut-user-auth'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      LoginEndpoint(email, password),
    onSuccess: async (data) => {
      setStatus('LOADING');
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
      setStatus('LOGOUT');
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

  const value = { user, authenticate, signOut, status, loading: getUser.isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
