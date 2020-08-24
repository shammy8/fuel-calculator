import { Component, OnInit } from '@angular/core';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
      linkAnonCloudFunction({ credential });
    }
  }

  // todo update user doc when an anon user hook up to google account
  linkAnonymousToGoogleAccount(user: User) {
    user.linkWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
}
