import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap, shareReplay, tap } from 'rxjs/operators';

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
  // todo add error handling
  async addFuel(
    fuelData: FuelHistory,
    previousData: Car
  ): Promise<[void, void]> {
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
      .doc(`cars/${previousData.docId}/history/${fuelData.mileage}`)
      .set(newLatestHistory);

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

  /**
   * todo add error handling
   * @param carDetails carDetails of the car history being deleted
   */
  deleteLatestFuelling(carDetails: Car): Promise<void> {
    // get the mileage of second newest history doc
    const mileageOf2ndNewestHistory =
      carDetails.latestHistory.mileage -
      carDetails.latestHistory.mileageSinceRecordsBegan;

    // start a transaction to make sure the update and delete are done atomically
    return this.afs.firestore.runTransaction((transaction) => {
      return transaction
        .get(
          // get the history doc of the second newest document
          this.afs.doc(
            `cars/${carDetails.docId}/history/${mileageOf2ndNewestHistory}`
          ).ref
        )
        .then((secondNewestHistory) => {
          if (carDetails.latestHistory.mileageSinceRecordsBegan === 0) {
            // if this is the only history

            // update latestHistory of the car document with the 2nd newest history
            transaction.update(this.afs.doc(`cars/${carDetails.docId}`).ref, {
              dateOfFirstHistory: null,
              latestHistory: null,
            });

            // delete the only history from history collection
            transaction.delete(
              this.afs.doc<FuelHistory>(
                `cars/${carDetails.docId}/history/${carDetails.latestHistory.mileage}`
              ).ref
            );
          } else {
            // else if this isn't the only history

            // update latestHistory of the car document with the 2nd newest history
            transaction.update(this.afs.doc(`cars/${carDetails.docId}`).ref, {
              latestHistory: secondNewestHistory.data(),
            });

            // delete the oldest history from history collection
            transaction.delete(
              this.afs.doc<FuelHistory>(
                `cars/${carDetails.docId}/history/${carDetails.latestHistory.mileage}`
              ).ref
            );
          }
        });
    });
  }

  /**
   * delete car documents and all it's history
   * todo move this to a firebase functions to delete all subcollections too??
   * @param carDetails carDetails of the car being deleted
   */
  async deleteCar(carDetails: Car): Promise<void> {
    return this.afs.doc(`cars/${carDetails.docId}`).delete();
  }
}
