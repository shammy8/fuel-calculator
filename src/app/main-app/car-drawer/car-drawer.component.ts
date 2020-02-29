import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  addCar() {
    this.router.navigate(['add']);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['login']));
  }
}
