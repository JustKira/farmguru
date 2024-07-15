import api from './api';

interface IrrigationPoint {
  FieldId?: string;
  duration?: string;
  datetime: string;
  ActionMaker: string;
}

export default async function createUpdateIrrigationPointEndpoint(data: IrrigationPoint) {
  const response = await api.post('/fields/irrigations/add', {
    ...data,
    Status: 'NEW',
  });
  return response.data.data;
}
