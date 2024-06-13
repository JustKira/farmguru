import * as FileSystem from 'expo-file-system';

import getStorageEndpoint from '~/lib/endpoints/get-storage';

/**
 * Retrieves a file's path locally by its storage key, fetching the URL and downloading the file.
 * @param key The storage key of the file.
 * @param accountId The account ID associated with the user, optional.
 * @returns The local file path or null if an error occurs.
 */
async function getCachedFilePathByKey(accountId: string, key?: string): Promise<string | null> {
  if (!key) return null;

  try {
    // Fetch the URL using the provided key and account ID.

    const url = await getStorageEndpoint(key, accountId);
    if (!url) {
      console.error('Failed to get URL for key:', key);
      return null;
    }

    // Define the filename based on the URL's last segment.
    const filename = url.split('/').pop() || `${key}_default_filename`;
    const localUri = `${FileSystem.documentDirectory}${filename}`;

    // Perform the download operation.
    const result = await FileSystem.downloadAsync(url, localUri);
    if (result.status !== 200) {
      console.error('Failed to download the file:', key);
      return null;
    }

    return result.uri; // Return the local file path.
  } catch (error) {
    console.error(`Error in getting file path by key (${key}):`, error);
    return null;
  }
}

export default getCachedFilePathByKey;
