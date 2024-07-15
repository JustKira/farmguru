import axios from 'axios';

import { BACKEND_API } from '..';

import { UserData } from '~/types/global.types';

interface UserResponseData {
  AccessToken: string;
  RefreshToken: string;
  AccountId: string;
  AccountType: string;
  Email: string;
  LoginId: string;
  Name: string;
}

export default async function LoginEndpoint(email: string, password: string) {
  try {
    const response = await axios.post<{ data: UserResponseData }>(`${BACKEND_API}/accounts/login`, {
      email,
      password,
    });

    const data = response.data.data;
    const user: UserData = {
      accountId: data.AccountId,
      loginId: data.LoginId,
      accountType: data.AccountType,
      email: data.Email,
      name: data.Name,
      accessToken: data.AccessToken,
      refreshToken: data.RefreshToken,
    };

    return user;
  } catch (error) {
    throw new Error('Failed to login');
  }
}
