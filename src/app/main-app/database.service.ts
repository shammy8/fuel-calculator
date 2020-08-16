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
  user: User;
  user$: Observable<User> = this.afAuth.user.pipe(
    tap(console.log),
    shareReplay()
  );

  uiElements$: Observable<UIElements> = this.afs
    .doc('general/ui')
    .valueChanges()
    .pipe(shareReplay());

  // the cars of a particular user
  cars$: Observable<Car[] | []> = this.user$.pipe(
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
    previousData: Car,
    user: User
  ): Promise<void> {
    const previousHistory = previousData.latestHistory;
    let bodyToUpdateCarDoc: Car;

    // update the latest history with new values from the form
    let newLatestHistory: FuelHistory = this.updateLatestHistory(
      previousHistory,
      fuelData
    );

    // then add the details of who added this fuelling history
    newLatestHistory = {
      ...newLatestHistory,
      fueller: { uid: user.uid, displayName: user.displayName },
    };

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

    // start a transaction to set and update atomically
    return this.afs.firestore.runTransaction(async (transaction) => {
      const carDoc = await transaction.get(
        // get the car document to make sure it is up to date
        this.afs.doc(`cars/${previousData.docId}`).ref
      );
      // update latest history in car document
      transaction.update(
        this.afs.doc(`cars/${previousData.docId}`).ref,
        bodyToUpdateCarDoc
      );
      // add the new history into the history subcollection
      transaction.set(
        this.afs.doc(`cars/${previousData.docId}/history/${fuelData.mileage}`)
          .ref,
        newLatestHistory
      );
    });
  }

  /**
   * @description calculate the newest history document
   * @param fuelData the data from the add fuel form
   * @param previousData the Car data of the previous fuelling
   */
  private updateLatestHistory(
    previousHistory: FuelHistory,
    fuelData: FuelHistory
  ) {
    // ternary expression is used to handle first fuelling and non-first fuelling
    const mileageSinceRecordsBegan = previousHistory?.mileage
      ? previousHistory.mileageSinceRecordsBegan +
        (fuelData.mileage - previousHistory.mileage)
      : 0;
    const mileageIncrease = previousHistory?.mileage
      ? fuelData.mileage - previousHistory.mileage
      : fuelData.mileage;
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
      mileageIncrease,
      costSinceRecordsBegan,
      volumeSinceRecordsBegan,
      avgMilesPerVolume,
      avgPricePerMile,
    };

    return newLatestHistory;
  }

  /**
   * delete the newest history and update the latestHistory in the car document with the second newest history
   * todo add error handling
   * @param carDetails carDetails of the car history being deleted
   */
  deleteLatestFuelling(carDetails: Car): Promise<void> {
    // get the mileage of second newest history doc
    const mileageOf2ndNewestHistory =
      carDetails.latestHistory.mileage -
      carDetails.latestHistory.mileageIncrease;

    // start a transaction to make sure the update and delete are done atomically
    return this.afs.firestore.runTransaction(async (transaction) => {
      const secondNewestHistory = await transaction.get(
        // get the history doc of the second newest document to use to update the carDoc
        this.afs.doc(
          `cars/${carDetails.docId}/history/${mileageOf2ndNewestHistory}`
        ).ref
      );
      const carDoc = await transaction.get(
        this.afs.doc(`cars/${carDetails.docId}`).ref
      );

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

        // delete the newest history from history collection
        transaction.delete(
          this.afs.doc<FuelHistory>(
            `cars/${carDetails.docId}/history/${carDetails.latestHistory.mileage}`
          ).ref
        );
      }
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
