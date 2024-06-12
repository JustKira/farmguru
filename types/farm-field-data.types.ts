/* eslint-disable @typescript-eslint/no-unused-vars */

interface FarmFieldData {
  id: string;
  farmId: string;
  hasAnalytics: boolean;
  location: [number, number][];
  name: string;
  cropType: string;
  irrigationSystem: string;
  plantdate: string;
  satellites: string[];
  percentage: Record<string, unknown>; // Assuming dynamic keys and values, adjust if known
  weather: Weather;
  recommendedWater: number;
  fieldArea: number;
  zoom: number;
  area: [number, number];
  irrigationDate: null; // or string if it can hold a date
  position: [number, number];
  positionMin: [number, number];
  positionMax: [number, number];
  center: [number, number];
  markersList: Marker[];
  irrigationsList: any[]; // Specify further if the structure is known
  fertilizationList: any[]; // Specify further if the structure is known
  pesticideList: any[]; // Specify further if the structure is known
  tabs: Tabs;
  zones: any[]; // Specify further if the structure is known
}

interface Weather {
  humidity: number;
  perception: number;
  temp: number;
  wind: number;
}

interface Marker {
  id: string;
  fieldId: string;
  markerDate: string;
  markerLocation: [number, number];
  photos: string[];
  issueSeverity: string;
  issueCategory: string;
  issueSubCategory: string;
  notes: string;
  status: string;
  lastView: string;
  reply: string;
  voiceNote: string;
  voiceReply: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  isDeleted: boolean;
}

interface Tabs {
  croprobo: CropRobo;
  info: Info;
  irrigrobo: IrrigRobo;
  pesticide: Pesticide;
  scoutrobo: ScoutRobo;
}

interface CropRobo {
  overlays: Overlay[];
  cropData: CropData[];
  lastUpdate: string;
  perviousUpdate: string; // Note the typo, consider if it should be "previousUpdate"
}

interface Info {
  overlays: Overlay[];
  infoData: InfoData[];
  lastUpdate: string;
  perviousUpdate: string;
}

interface IrrigRobo {
  overlays: Overlay[];
  irrigData: IrrigData[];
  hourlySm: number[];
  lastUpdate: string;
  perviousUpdate: string;
  moistureHourly: number[];
}

interface Pesticide {
  overlays: Overlay[];
  lastUpdate: string;
  perviousUpdate: string;
  pesticideDiseases: PesticideDisease[];
  pesticideSpraying: PesticideSpraying[];
}

interface ScoutRobo {
  overlays: Overlay[];
  lastUpdate: string;
  perviousUpdate: string;
}

interface Overlay {
  arName: string;
  enName: string;
  image: string;
  mean: number[];
  max: number[];
  min: number[];
  markers: any[]; // Specify further if the structure is known
}

interface CropData {
  name: string;
  percentages: Percentage[];
}

interface InfoData {
  name: string;
  value: string;
  comment: string;
}

interface IrrigData {
  name: string;
  value: number;
  unit: string;
}

interface PesticideDisease {
  Name: string;
  Translation: Translation;
}

interface PesticideSpraying {
  datetime: string;
  value: string;
}

interface Translation {
  ar: string;
  en: string;
}

interface Percentage {
  value: number;
  color: string;
}
