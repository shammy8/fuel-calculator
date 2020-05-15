import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { User } from 'firebase';

import { Car, UIElements } from './Car.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  uiElements$: Observable<UIElements> = this.afs
    .doc('general/ui')
    .valueChanges()
    .pipe(shareReplay());

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  // fetch the cars of a particular user
  fetchCars(): Observable<Car[] | []> {
    return this.afAuth.user.pipe(
      switchMap((user: User) => {
        if (user) {
          return this.afs
            .collection<Car[]>('cars', (ref) =>
              ref.where('uid', '==', user.uid)
            )
            .valueChanges();
        } else {
          // if user is logged out return empty array observable
          return of([]);
        }
      })
    );
  }

  async addVehicle(carData: Car): Promise<DocumentReference> {
    const currentUser = await this.afAuth.currentUser;
    return this.afs.collection('cars').add({
      ...carData,
      uid: currentUser.uid,
    });
  }
}
