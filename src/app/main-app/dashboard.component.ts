import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Car } from './Car.model';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-main-app',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // cars$: Observable<Car[]> = this.databaseService.cars$;
  cars: Car[];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.databaseService.cars$.subscribe((cars) => (this.cars = cars));
  }

  drop(event: CdkDragDrop<Car[]>) {
    console.log(event);
    moveItemInArray(this.cars, event.previousIndex, event.currentIndex);
  }
}
