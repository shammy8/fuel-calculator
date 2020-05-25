import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  googleLogin() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  anonymousLogin() {
    this.afAuth.signInAnonymously().then(console.log);
  }
}
