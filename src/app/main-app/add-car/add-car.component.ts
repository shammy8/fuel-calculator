import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { DatabaseService } from '../database.service';
import { UIElements } from '../Car.model';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
})
export class AddCarComponent implements OnInit {
  addCarForm: FormGroup;

  uiElements$: Observable<UIElements> = this.databaseService.uiElements$;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.addCarForm = this.fb.group({
      name: ['', [Validators.required]],
      logo: '',
      engineType: '',
      date: [new Date(), [Validators.required]],
      mileage: [
        0,
        [Validators.required, Validators.min(0), Validators.max(9999999)],
      ],
    });
  }

  addVehicle(): void {
    this.databaseService.addVehicle(this.addCarForm.value);
  }
}
