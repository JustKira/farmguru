import { NewField } from '~/lib/db/schemas';

export function fieldParser(data: FarmField): NewField {
  const newField: NewField = {
    id: data.id,
    name: data.name,
    farmId: data.farmId,
    location: data.location,
    position: data.position,
    bounds: [
      [data.positionMin[0], data.positionMin[1]],
      [data.positionMax[0], data.positionMax[1]],
    ],
  };
  return newField;
}
