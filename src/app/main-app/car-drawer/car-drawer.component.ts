import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

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
        return result.matches;
      }),
      shareReplay()
    );

  @ViewChild('sidenav') drawer;

  userSub: Subscription;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.userSub = this.afAuth.user.subscribe(user => {
      if (user) {
        this.cars$ = this.afs
          .collection('cars', ref => ref.where('uid', '==', user.uid))
          .valueChanges();
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
