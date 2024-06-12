export type SyncState =
  | 'NO_CONNECTION_NO_CACHE'
  | 'NO_CONNECTION_CACHE'
  | 'LOADING'
  | 'SYNCING'
  | 'SYNCED'
  | 'ERROR';

export const NO_CONNECTION_NO_CACHE: SyncState = 'NO_CONNECTION_NO_CACHE';
export const NO_CONNECTION_CACHE: SyncState = 'NO_CONNECTION_CACHE';
export const LOADING: SyncState = 'LOADING';
export const SYNCING: SyncState = 'SYNCING';
export const SYNCED: SyncState = 'SYNCED';
export const ERROR: SyncState = 'ERROR';
