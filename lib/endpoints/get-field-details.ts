import api from './api';

export default async function getFieldDetailsEndpoint(fieldId: string, actionMaker: string) {
  const response = await api.post('/fields/mobile/getFieldDetails', {
    FieldId: fieldId,
    ActionMaker: actionMaker,
  });
  return response.data.data as FarmFieldData;
}
