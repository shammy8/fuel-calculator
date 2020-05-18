export interface Car {
  dateAdded?: Date;
  date?: Date;
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
