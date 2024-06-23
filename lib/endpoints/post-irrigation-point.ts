import { BACKEND_API } from '..';

interface IrrigationPoint {
  FieldId?: string;
  duration?: string;
  datetime: string;
  ActionMaker: string;
}

export default async function createUpdateIrrigationPointEndpoint(data: IrrigationPoint) {
  return fetch(`${BACKEND_API}/fields/irrigations/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      Status: 'NEW',
    }),
  });
}
