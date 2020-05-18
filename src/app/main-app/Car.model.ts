export interface Car {
  dateAdded?: Date;
  date?: Date;
  engineType?: string;
  logo?: string;
  mileage?: number;
  name?: string;
  uid?: string;
  LatestHistory: FuelHistory;
  fuellingHistory?: FuelHistory[];
}

export interface FuelHistory {
  avgPricePerMile: number;
  avgPricePerVolume: number;
  comment: string;
  cost: 40;
  costSinceRecordsBegan: number;
  date: Date;
  mileage: number;
  mileageSinceRecordsBegan: number;
  volume: number;
  volumeSinceRecordsBegan: number;
}

export interface UIElements {
  engineTypes?: { label: string; value: string }[];
  logos?: string[];
}
