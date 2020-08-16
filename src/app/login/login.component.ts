import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // todo handle error
  googleLogin() {
    this.afAuth
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.router.navigate(['']);
      });
  }

  anonymousLogin() {
    this.afAuth.signInAnonymously().then(() => {
      this.router.navigate(['']);
    });
  }
}
