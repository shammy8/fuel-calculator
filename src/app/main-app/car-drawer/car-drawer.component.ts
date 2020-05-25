import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { DatabaseService } from '../database.service';
import { Car } from '../Car.model';
import { AddCarComponent } from '../add-car/add-car.component';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit, OnDestroy {
  cars$: Observable<Car[]> = this.databaseService.cars$;

  isHandset: boolean; // consider under 780px a handset screen

  user: firebase.User;
  authSub: Subscription;

  @ViewChild('sidenav') drawer: MatSidenav;

  constructor(
    public afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private databaseService: DatabaseService,
    private addCarBottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 780px)'])
      .subscribe((res) => (this.isHandset = res.matches));

    this.authSub = this.afAuth.user.subscribe((user) => {
      this.user = user;
    });
  }

  addCar(): void {
    this.addCarBottomSheet.open(AddCarComponent, { autoFocus: true });
    this.handleCloseDrawerOnClick();
  }

  signOut(): void {
    this.afAuth.signOut();
  }

  onCarClick(car): void {
    // console.log(car);
    this.handleCloseDrawerOnClick();
  }

  // handles whether to close drawer after clicking on the buttons in side drawer
  handleCloseDrawerOnClick(): void {
    if (this.isHandset) {
      this.drawer.close();
    }
  }

  linkAnonymousToGoogleAccount() {
    this.user.linkWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
