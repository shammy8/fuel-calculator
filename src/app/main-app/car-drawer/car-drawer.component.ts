import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { DatabaseService } from '../database.service';
import { Car } from '../Car.model';
import { AddCarComponent } from '../add-car/add-car.component';
import { LoseAllDataWarningDialogComponent } from 'src/app/dialog-boxes/lose-all-data-warning-dialog.component';

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
  breakSub: Subscription;

  @ViewChild('sidenav') drawer: MatSidenav;

  constructor(
    public afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private databaseService: DatabaseService,
    private addCarBottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakSub = this.breakpointObserver
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

  // todo handle error
  signOut(): void {
    if (this.user.isAnonymous) {
      this.dialog.open(LoseAllDataWarningDialogComponent, {
        width: '500px',
      });
    } else {
      this.afAuth.signOut().then(() => {
        this.router.navigate(['login']);
      });
    }
  }

  onCarClick(car): void {
    this.handleCloseDrawerOnClick();
  }

  // handles whether to close drawer after clicking on the buttons in side drawer
  handleCloseDrawerOnClick(): void {
    if (this.isHandset) {
      this.drawer.close();
    }
  }

  ngOnDestroy() {
    this.breakSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
