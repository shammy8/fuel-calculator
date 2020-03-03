import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit, OnDestroy {
  cars$;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 780px)'])
    .pipe(
      map(result => {
        return result.matches; // returns true if below 780px width
      }),
      shareReplay() // share to subscription among the various times we use async pipes
    );

  @ViewChild('sidenav') drawer: MatSidenav;

  userSub: Subscription;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver // private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.userSub = this.afAuth.user.subscribe(user => {
      if (user) {
        this.cars$ = this.afs
          .collection('cars', ref => ref.where('uid', '==', user.uid))
          .valueChanges();
      } else {
        // if user is logged out return empty array observable
        this.cars$ = of([]);
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  addCar() {
    this.router.navigate(['add']);
    // this.ngZone.run(() => this.router.navigate(['add']));
    this.handleCloseDrawer();
  }

  signOut(): void {
    this.afAuth.signOut();
  }

  handleCloseDrawer(): void {
    let isHandset: boolean;
    this.isHandset$.subscribe(res => (isHandset = res));

    if (isHandset) {
      this.drawer.close();
    }
  }
}
