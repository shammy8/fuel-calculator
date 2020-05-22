import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { Car } from '../Car.model';
import { DatabaseService } from '../database.service';

// custom validator to ensure entered value is greater than the value in the previous fuelling history
function mustBeGreaterThanPrevious(previous: any): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && c.value < previous) {
      return { greaterThanPrevious: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrls: ['./add-history.component.scss'],
})
export class AddHistoryComponent implements OnInit {
  addFuelForm: FormGroup;

  @ViewChild('addFuelButton') addFuelButton: MatButton;

  constructor(
    private databaseService: DatabaseService,
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddHistoryComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public carDetails: Car
  ) {}

  ngOnInit(): void {
    this.addFuelForm = this.fb.group({
      mileage: [
        this.carDetails.latestHistory.mileage ?? null,
        [
          Validators.required,
          mustBeGreaterThanPrevious(this.carDetails.latestHistory.mileage),
        ],
      ],
      volume: [null, [Validators.required]],
      cost: [null, [Validators.required]],
      date: [
        new Date(),
        [
          Validators.required,
          mustBeGreaterThanPrevious(
            this.carDetails.latestHistory.date?.toDate()
          ),
        ],
      ],
      comments: [''],
    });
  }

  addFuel() {
    this.addFuelButton.disabled = true;
    this.databaseService
      .addFuel(this.addFuelForm.value, this.carDetails)
      .then(() => this.bottomSheetRef.dismiss())
      .catch(() => (this.addFuelButton.disabled = false));
  }

  onReset() {
    this.addFuelForm.reset();
  }

  onCancel(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
