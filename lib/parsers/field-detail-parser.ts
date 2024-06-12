import { NewFieldDetail } from '../db/schemas';

export function fieldDetailsInfoParser(data: FarmFieldData): NewFieldDetail {
  const lastInfoUpdate = data.tabs.info.lastUpdate;
  const lastCropUpdate = data.tabs.croprobo.lastUpdate;
  const lastIrrigationUpdate = data.tabs.irrigrobo.lastUpdate;
  const lastScoutUpdate = data.tabs.scoutrobo.lastUpdate;

  const nutrients =
    data.tabs.croprobo.cropData.find((cropData) => cropData.name === 'Nutrients')?.percentages ??
    [];
  const stress =
    data.tabs.croprobo.cropData.find((cropData) => cropData.name === 'Stress')?.percentages ?? [];

  const growth =
    data.tabs.croprobo.cropData.find((cropData) => cropData.name === 'Growth')?.percentages ?? [];

  const growthTrend = growth[0].value.toString();
  const nutrientsTrend = nutrients[0].value.toString();
  const stressTrend = stress[0].value.toString();

  const today = new Date();

  const cropAge = Math.abs(
    (new Date(data.plantdate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  ).toFixed();

  return {
    id: data.id,
    lastInfoUpdate,
    lastCropUpdate,
    lastIrrigationUpdate,
    lastScoutUpdate,
    cropAge: cropAge.toString(),
    cropType: data.cropType,
    growthPercentage: [growth[1].value, growth[2].value, growth[3].value, growth[4].value],
    nutrientsPercentage: [
      nutrients[1].value,
      nutrients[2].value,
      nutrients[3].value,
      nutrients[4].value,
    ],
    stressPercentage: [stress[1].value, stress[2].value, stress[3].value, stress[4].value],
    growthTrend,
    nutrientsTrend,
    stressTrend,
  };
}
