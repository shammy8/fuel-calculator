import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { User } from 'firebase';

import { Car } from './Car.model';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-main-app',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // cars$: Observable<Car[]> = this.databaseService.cars$;
  cars: Car[];
  user: User;
  carSub: Subscription;
  userSub: Subscription;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.carSub = this.databaseService.cars$.subscribe(
      (cars) => (this.cars = cars)
    );
    this.userSub = this.databaseService.user$.subscribe(
      (user) => (this.user = user)
    );
  }

  drop(event: CdkDragDrop<Car[]>): void {
    moveItemInArray(this.cars, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy() {
    this.carSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
