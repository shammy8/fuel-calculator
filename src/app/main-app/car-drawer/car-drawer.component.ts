import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';

import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit {
  cars$: Observable<any>; // TODO change the any with the model

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 780px)'])
    .pipe(
      map(result => {
        return result.matches; // returns true if below 780px width
      }),
      shareReplay() // share the subscription among all the times we use async pipes
    );

  @ViewChild('sidenav') drawer: MatSidenav;

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.cars$ = this.databaseService.fetchCars();
  }

  addCar() {
    this.router.navigate(['add']);
    this.handleCloseDrawerOnClick();
  }

  signOut(): void {
    this.afAuth.signOut();
  }

  handleCloseDrawerOnClick(): void {
    let isHandset: boolean;
    this.isHandset$.subscribe(res => (isHandset = res));

    if (isHandset) {
      this.drawer.close();
    }
  }
}
