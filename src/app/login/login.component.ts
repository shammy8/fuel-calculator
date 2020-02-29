import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {}

  async googleLogin() {
    await this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    this.router.navigate(['']);
  }
}
