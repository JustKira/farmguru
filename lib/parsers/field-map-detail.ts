export function fieldDetailsImageParser(data: FarmFieldData): {
  default: string;
  nitrogen?: string;
  anomaly?: string;
  growth?: string;
  irrigation?: string;
} {
  const defaultImageKey = data.tabs.info.overlays[0].image;

  const nitrogenImageKey = data.tabs.croprobo.overlays.find(
    (overlay) => overlay.enName === 'nitrogen'
  )?.image;
  const anomalyImageKey = data.tabs.croprobo.overlays.find(
    (overlay) => overlay.enName === 'anomly'
  )?.image;
  const growthImageKey = data.tabs.croprobo.overlays.find(
    (overlay) => overlay.enName === 'growth'
  )?.image;

  const irrigationImageKey = data.tabs.irrigrobo.overlays.find(
    (overlay) => overlay.enName === 'irrig'
  )?.image;

  const images = {
    default: defaultImageKey,
    nitrogen: nitrogenImageKey,
    anomaly: anomalyImageKey,
    growth: growthImageKey,
    irrigation: irrigationImageKey,
  };

  return images;
}
