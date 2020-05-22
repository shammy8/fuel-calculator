import { Component, OnInit, Inject } from '@angular/core';
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

import { Car } from '../Car.model';
import { DatabaseService } from '../database.service';

// custom validator to ensure entered value is greater than the value in the previous fuelling history
// TODO what happens if the date is null
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
    this.databaseService.addFuel(this.addFuelForm.value, this.carDetails);
  }

  onReset() {
    this.addFuelForm.reset();
  }

  onCancel(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
