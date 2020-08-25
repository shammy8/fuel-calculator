import { Component, OnInit, OnDestroy } from '@angular/core';
import { share } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { User } from 'firebase';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  user$: Observable<User> = this.afAuth.user.pipe(share());
  subscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private fns: AngularFireFunctions
  ) {}

  ngOnInit() {
    this.justLinkedToEmail();
  }

  private async justLinkedToEmail() {
    const credential: firebase.auth.UserCredential = await this.afAuth.getRedirectResult();
    console.log(credential);
    if (credential.user) {
      const linkAnonCloudFunction = this.fns.httpsCallable('linkAnonymous');
      this.subscription = linkAnonCloudFunction({
        uid: credential.user.uid,
        displayName: credential.user.displayName,
        email: credential.user.email,
      }).subscribe();
    }
  }

  // todo update user doc when an anon user hook up to google account
  linkAnonymousToGoogleAccount(user: User) {
    user.linkWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
