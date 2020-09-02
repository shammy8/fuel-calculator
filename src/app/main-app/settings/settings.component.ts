import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';

import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user$: Observable<User> = this.databaseService.user$; // .pipe(share());

  userDoc$ = this.databaseService.userDoc$;
  minMilesLitre = new FormControl([]);
  maxMilesLitre = new FormControl([]);
  minPriceMile = new FormControl([]);
  maxPriceMile = new FormControl([]);

  constructor(
    private afAuth: AngularFireAuth,
    private fns: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.justLinkedToEmail();

    this.userDoc$.subscribe((userDoc) => {
      this.minMilesLitre.patchValue(
        userDoc.gauges.milesPerVolume.min.toString()
      );
      this.maxMilesLitre.patchValue(
        userDoc.gauges.milesPerVolume.max.toString()
      );
      this.minPriceMile.patchValue(userDoc.gauges.pricePerMile.min.toString());
      this.maxPriceMile.patchValue(userDoc.gauges.pricePerMile.max.toString());
    });
  }

  // check if user just got redirected from linking anon account to email
  // if so update the user's user doc with the email and name
  private async justLinkedToEmail() {
    try {
      const credential: firebase.auth.UserCredential = await this.afAuth.getRedirectResult();
      if (credential.user) {
        const linkAnonCloudFunction = this.fns.httpsCallable('linkAnonymous');

        const res = await linkAnonCloudFunction({
          uid: credential.user.uid,
          displayName: credential.user.displayName,
          email: credential.user.email,
        }).toPromise();

        this.snackBar.open(
          'Your anonymous account has been successfully linked!',
          'Close',
          {
            duration: 5000,
          }
        );
      }
    } catch (error) {
      this.snackBar.open(error, 'Close', {
        duration: 5000,
      });
    }
  }

  linkAnonymousToGoogleAccount(user: User) {
    user.linkWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
}
