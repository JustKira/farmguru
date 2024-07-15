import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useEffect, useState } from 'react';

import { BACKEND_API } from '..';
import LoginEndpoint from '../endpoints/login';

import { UserData } from '~/types/global.types';
import api from '../endpoints/api';

type AuthStatus = 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'LOGOUT';

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  status: AuthStatus;
  authenticate: (email: string, password: string) => Promise<{ authenticated: boolean }>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('LOADING');
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserData | null>(null);

  const getUser = useQuery({
    queryKey: ['user-auth'],
    queryFn: async () => {
      const res = await SecureStore.getItem('user');
      if (res) {
        setStatus('AUTHENTICATED');
      } else {
        setStatus('UNAUTHENTICATED');
      }
      return res ?? null;
    },
    retry: false,
  });

  // const refersh = async () => {
  //   await SecureStore.setItem('accessToken', data.accessToken);
  // }

  const authenticateMutation = useMutation({
    mutationKey: ['mut-user-auth'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      LoginEndpoint(email, password),
    onSuccess: async (data) => {
      setStatus('LOADING');

      await SecureStore.setItem('user', JSON.stringify(data));
      await SecureStore.setItem('accessToken', data.accessToken);
      await SecureStore.setItem('refreshToken', data.refreshToken);
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
    mutationFn: async () => {
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    },
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
    if (res.loginId) {
      api.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;
      return { authenticated: true };
    }
    return { authenticated: false };
  };

  const signOut = async () => {
    await logoutMutation.mutateAsync();
    delete api.defaults.headers.common['Authorization'];
  };

  const getAccessToken = async () => {
    return SecureStore.getItem('accessToken');
  };

  const value = {
    user,
    authenticate,
    signOut,
    status,
    loading: getUser.isLoading,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
