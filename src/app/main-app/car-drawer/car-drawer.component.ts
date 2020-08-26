import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { AddCarComponent } from '../add-car/add-car.component';
import { LoseAllDataWarningDialogComponent } from 'src/app/dialog-boxes/lose-all-data-warning-dialog.component';
import { pluck, share } from 'rxjs/operators';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit, OnDestroy {
  // consider under 700px a handset screen, this needs to match css media query
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 700px)'])
    .pipe(pluck('matches'), share());

  user: firebase.User;

  subscription: Subscription;

  @ViewChild('sidenav') drawer: MatSidenav;

  constructor(
    public afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private addCarBottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.afAuth.user.subscribe((user) => {
      this.user = user;
    });
  }

  addCar(): void {
    this.addCarBottomSheet.open(AddCarComponent, { autoFocus: true });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
