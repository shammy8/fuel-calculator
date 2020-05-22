// import { Timestamp } from '@google-cloud/firestore';

export interface Car {
  date?: any; // Timestamp;
  engineType?: string;
  fuellingHistory?: FuelHistory[];
  latestHistory: FuelHistory;
  logo?: string;
  name?: string;
  uid?: string;
}

export class FuelHistory {
  avgMilesPerVolume?: number;
  avgPricePerMile?: number;
  comment?: string;
  cost?: number;
  costSinceRecordsBegan = 0;
  date?: any; // Timestamp;
  mileage?: number;
  mileageSinceRecordsBegan = 0;
  volume?: number;
  volumeSinceRecordsBegan = 0;
}

export interface UIElements {
  engineTypes?: { label: string; value: string }[];
  logos?: string[];
}
