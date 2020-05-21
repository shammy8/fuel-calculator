import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Car } from './Car.model';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-main-app',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  cars$: Observable<Car[]> = this.databaseService.cars$;

  constructor(private databaseService: DatabaseService) {}
}
