import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';

import { DatabaseService } from '../database.service';
import { Car } from '../Car.model';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit {
  cars$: Observable<Car[]> = this.databaseService.cars$;
  isHandset: boolean; // consider under 780px a handset screen

  @ViewChild('sidenav') drawer: MatSidenav;

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private breakpointObserver: BreakpointObserver,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 780px)'])
      .subscribe((res) => (this.isHandset = res.matches));
  }

  addCar() {
    this.router.navigate(['add']);
    this.handleCloseDrawerOnClick();
  }

  signOut(): void {
    this.afAuth.signOut();
  }

  onCarClick(car) {
    console.log(car);
    this.handleCloseDrawerOnClick();
  }

  // handles whether to close drawer after clicking on the buttons in side drawer
  handleCloseDrawerOnClick(): void {
    if (this.isHandset) {
      this.drawer.close();
    }
  }
}
