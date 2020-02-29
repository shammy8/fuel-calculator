import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit {
  cars$;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    const uid = this.afAuth.auth.currentUser.uid;
    this.cars$ = this.afs
      .collection('cars', ref => ref.where('uid', '==', uid))
      .valueChanges();
  }

  addCar() {
    this.router.navigate(['add']);
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['login']));
  }
}
