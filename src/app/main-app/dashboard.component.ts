import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Car } from './Car.model';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-main-app',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  cars$: Observable<Car[]> = this.databaseService.cars$;
  addClicked = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {}

  onAdd() {
    this.addClicked = true;
    console.log(this.addClicked);
  }
}
