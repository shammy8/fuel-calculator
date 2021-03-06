// import { Timestamp } from '@google-cloud/firestore';

export interface Car {
  date?: any; // Timestamp;
  dateOfFirstHistory?: any; // Timestamp;
  docId?: string;
  drivers?: string[]; // uids of the people who can edit the car (include owner)
  engineType?: string;
  fuellingHistory?: FuelHistory[];
  latestHistory?: FuelHistory;
  logo?: string;
  name?: string;
  owner?: string; // uid of the owner of the car
}

export class FuelHistory {
  avgMilesPerVolume?: number;
  avgPricePerMile?: number;
  comment?: string;
  cost?: number;
  costSinceRecordsBegan = 0;
  date?: any; // Timestamp;
  fueller?: { uid: string; displayName: string };
  mileage?: number;
  mileageIncrease?: number;
  mileageSinceRecordsBegan = 0;
  volume?: number;
  volumeSinceRecordsBegan = 0;
}

export interface UIElements {
  engineTypes?: { label: string; value: string }[];
  logos?: string[];
}

export interface UserDoc {
  createdAt?: string; // todo change this to a date?
  email?: string;
  gauges?: { milesPerVolume: MinMax; pricePerMile: MinMax };
  name?: string;
  tableColumns?: string[];
  uid?: string;
}

export interface MinMax {
  max: number;
  min: number;
}
