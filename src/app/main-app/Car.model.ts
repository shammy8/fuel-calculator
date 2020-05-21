// import { Timestamp } from '@google-cloud/firestore';

export interface Car {
  dateAdded?: any; // Timestamp;
  date?: any; // Timestamp;
  engineType?: string;
  fuellingHistory?: FuelHistory[];
  latestHistory: FuelHistory;
  logo?: string;
  name?: string;
  uid?: string;
}

export interface FuelHistory {
  avgMilesPerVolume: number;
  avgPricePerMile: number;
  comment: string;
  cost: 40;
  costSinceRecordsBegan: number;
  date: any; // Timestamp;
  mileage: number;
  mileageSinceRecordsBegan: number;
  volume: number;
  volumeSinceRecordsBegan: number;
}

export interface UIElements {
  engineTypes?: { label: string; value: string }[];
  logos?: string[];
}
