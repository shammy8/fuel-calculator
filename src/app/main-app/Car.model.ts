import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';

export interface Car {
  dateAdded?: Date;
  date?: Date;
  engineType?: string;
  logo?: string;
  mileage?: number;
  name?: string;
  uid?: string;
  fuellingHistory?: AngularFirestoreCollection;
}

export interface UIElements {
  engineTypes?: { label: string; value: string }[];
  logo?: string[];
}
