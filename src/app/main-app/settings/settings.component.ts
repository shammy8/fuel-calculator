import { Component, OnInit } from '@angular/core';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user$: Observable<User> = this.afAuth.user.pipe(share());

  constructor(
    private afAuth: AngularFireAuth,
    private fns: AngularFireFunctions,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.justLinkedToEmail();
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
