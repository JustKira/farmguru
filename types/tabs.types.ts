// types/TabContent.ts
import { ReactNode } from 'react';
import { TFunction } from 'i18next';
import type { ContextType } from '~/lib/providers/field-shared-data-provider';

export interface TabContentProps {
  shared: ContextType;
  t: TFunction;
  getState: (key: string) => any;
  setState: (key: string, value: any) => void;
}

export interface TabContent {
  map: {
    header: (props: TabContentProps) => ReactNode | null;
    overlays: (props: TabContentProps) => ReactNode | null;
  };
  sheet: {
    header: (props: TabContentProps) => ReactNode | null;
    body: (props: TabContentProps) => ReactNode | null;
  };
  icon: (active: boolean) => ReactNode | null;
}

export type TabName = 'INFO' | 'CROP' | 'SCOUT' | 'IRRIGATION';
