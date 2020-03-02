import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth/';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    // this will navigate the user when the user changes from logged in to out and vice versa
    this.afAuth.authState.subscribe(user => {
      user ? this.router.navigate(['']) : this.router.navigate(['login']);
    });
  }
}
