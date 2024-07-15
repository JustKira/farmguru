import api from './api';

export default async function uploadStorage(data: string, actionMaker: string, type: string) {
  const response = await api.post('/storage/upload', {
    Data: data,
    ActionMaker: actionMaker,
    Type: type,
  });
  console.log('Upload Storage', response.data);
  return response.data.data as string;
}
