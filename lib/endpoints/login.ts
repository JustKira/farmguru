import { BACKEND_API } from '..';

import { UserData } from '~/types/global.types';

interface UserResponseData {
  AccessToken: string;
  AccountId: string;
  AccountType: string;
  Email: string;
  LoginId: string;
  Name: string;
}

export default async function LoginEndpoint(email: string, password: string) {
  const response = await fetch(`${BACKEND_API}/accounts/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const res = await response.json();
    const data = res.data as UserResponseData;
    const user: UserData = {
      accountId: data.AccountId,
      loginId: data.LoginId,
      accountType: data.AccountType,
      email: data.Email,
      name: data.Name,
    };
    return user;
  } else {
    throw new Error('Failed to login');
  }
}
