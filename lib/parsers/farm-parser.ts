import { NewFarm } from '~/lib/db/schemas';

export function farmParser(data: Farm): NewFarm {
  const farms: NewFarm = {
    id: data.id,
    name: data.name,
    fieldIds: data.fields.map((field) => field.id),
  };
  return farms;
}
