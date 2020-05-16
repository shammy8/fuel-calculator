import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Car } from './Car.model';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-main-app',
  template: `
    <div *ngIf="cars$ | async as cars">
      <app-car-overview
        *ngFor="let car of cars"
        [carDetails]="car"
      ></app-car-overview>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  cars$: Observable<Car[]> = this.databaseService.cars$;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {}
}
