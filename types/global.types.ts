export interface UserData {
  accountId: string;
  loginId: string;
  accountType: string;
  email: string;
  name: string;
}

export type Severity = 'late' | 'moderate' | 'early';

export type Screens = 'INFO' | 'CROP' | 'IRRIGATION' | 'SCOUT';
