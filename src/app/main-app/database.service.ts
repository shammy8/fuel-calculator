import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { User } from 'firebase';

import { Car, FuelHistory, UIElements } from './Car.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  uiElements$: Observable<UIElements> = this.afs
    .doc('general/ui')
    .valueChanges()
    .pipe(shareReplay());

  // the cars of a particular user
  cars$: Observable<Car[] | []> = this.afAuth.user.pipe(
    switchMap((user: User) => {
      if (user) {
        return this.afs
          .collection<Car[]>('cars', (ref) =>
            ref.where('drivers', 'array-contains', user.uid)
          )
          .valueChanges({ idField: 'docId' });
      } else {
        // if user is logged out return empty array observable
        return of([]);
      }
    })
  );

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  async addVehicle(carData: Car): Promise<DocumentReference> {
    const currentUser = await this.afAuth.currentUser;
    // return
    return this.afs.collection('cars').add({
      ...carData,
      date: new Date(),
      owner: currentUser.uid,
      drivers: [currentUser.uid],
    } as Car);
  }

  /**
   * @description add latestHistory to history subcollection
   * and update the latestHistory with new user entered data
   * @param fuelData the data from the add fuel form
   * @param previousData the Car data of the previous fuelling
   */
  async addFuel(
    fuelData: FuelHistory,
    previousData: Car
  ): Promise<[DocumentReference, void]> {
    const previousHistory = previousData.latestHistory;
    let bodyToUpdateCarDoc: Car;

    // update the latest history with new values from the form
    const newLatestHistory: FuelHistory = this.updateLatestHistory(
      previousHistory,
      fuelData
    );

    if (previousHistory) {
      // if this isn't the first fuelling just change the latestHistory
      bodyToUpdateCarDoc = { latestHistory: newLatestHistory };
    } else {
      // else if this is the first fuelling need to add the dateOfFirstHistory to the car document too
      bodyToUpdateCarDoc = {
        latestHistory: newLatestHistory,
        dateOfFirstHistory: fuelData.date,
      };
    }

    // add the new history into the history subcollection
    const addHistory = this.afs
      .collection(`cars/${previousData.docId}/history`)
      .add(newLatestHistory);

    // update latest history in car document
    const updateLatestHistory = this.afs
      .doc(`cars/${previousData.docId}`)
      .update(bodyToUpdateCarDoc);

    return Promise.all([addHistory, updateLatestHistory]);
  }

  private updateLatestHistory(
    previousHistory: FuelHistory,
    fuelData: FuelHistory
  ) {
    const mileageSinceRecordsBegan = previousHistory?.mileage
      ? previousHistory.mileageSinceRecordsBegan +
        (fuelData.mileage - previousHistory.mileage)
      : 0;
    const costSinceRecordsBegan = previousHistory?.cost
      ? previousHistory.cost + previousHistory.costSinceRecordsBegan
      : 0;
    const volumeSinceRecordsBegan = previousHistory?.volume
      ? previousHistory.volume + previousHistory.volumeSinceRecordsBegan
      : 0;
    const avgMilesPerVolume = volumeSinceRecordsBegan
      ? mileageSinceRecordsBegan / volumeSinceRecordsBegan
      : null;
    const avgPricePerMile = mileageSinceRecordsBegan
      ? costSinceRecordsBegan / mileageSinceRecordsBegan
      : null;

    const newLatestHistory: FuelHistory = {
      ...fuelData,
      mileageSinceRecordsBegan,
      costSinceRecordsBegan,
      volumeSinceRecordsBegan,
      avgMilesPerVolume,
      avgPricePerMile,
    };

    return newLatestHistory;
  }

  // todo add typing, handle error
  // todo add code to recognise if a email or uid is entered
  addDriver(newDriverDetail: string, carDoc: Car): Promise<void> {
    // drivers has to be in the right order or firebase security rules will reject the request
    const drivers = [...carDoc.drivers, newDriverDetail];
    return this.afs.doc(`cars/${carDoc.docId}`).update({
      drivers,
    });
  }
}
