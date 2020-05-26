import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';

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

  @ViewChild('addVehicleButton') addVehicleButton: MatButton;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private bottomSheetRef: MatBottomSheetRef<AddCarComponent>
  ) {}

  ngOnInit(): void {
    this.addCarForm = this.fb.group({
      name: ['', [Validators.required]],
      logo: '',
      engineType: '',
    });
  }

  addVehicle(): void {
    this.addVehicleButton.disabled = true;
    this.databaseService
      .addVehicle(this.addCarForm.value)
      .then(() => this.bottomSheetRef.dismiss())
      .catch(() => (this.addVehicleButton.disabled = false));
  }

  onReset(): void {
    this.addCarForm.reset();
  }

  onCancel(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
