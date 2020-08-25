import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { User } from 'firebase';

import { Car } from './Car.model';
import { DatabaseService } from './database.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-main-app',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  cars: Car[];
  user: User;

  subscriptions: Subscription = new Subscription();

  constructor(
    private databaseService: DatabaseService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    // need below here or else it'll get called when user go to settings after logging in
    // and then that'll call a cloud function, which we don't want
    this.afAuth.getRedirectResult();

    this.subscriptions.add(
      this.databaseService.cars$.subscribe((cars) => (this.cars = cars))
    );
    this.subscriptions.add(
      this.databaseService.user$.subscribe((user) => (this.user = user))
    );
  }

  drop(event: CdkDragDrop<Car[]>): void {
    moveItemInArray(this.cars, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
