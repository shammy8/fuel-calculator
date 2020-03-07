import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  // fetch the cars of a particular user
  fetchCars() {
    return this.afAuth.user.pipe(
      switchMap((user: User) => {
        if (user) {
          return this.afs
            .collection('cars', ref => ref.where('uid', '==', user.uid))
            .valueChanges();
        } else {
          // if user is logged out return empty array observable
          return of([]);
        }
      })
    );
  }
}
