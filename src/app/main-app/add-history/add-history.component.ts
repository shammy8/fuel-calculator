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
import { combineLatest } from 'rxjs';

import { Car } from '../Car.model';
import { DatabaseService } from '../database.service';

// custom validator to ensure entered value is greater than the value in the previous fuelling history
function mustBeGreaterThanPrevious(previous: any): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && c.value <= previous) {
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
    this.initialiseForm();
    this.autoUpdateCostPerVolume();
  }

  private initialiseForm(): void {
    this.addFuelForm = this.fb.group({
      mileage: [
        this.carDetails.latestHistory?.mileage + 1 ?? null,
        [
          Validators.required,
          Validators.min(0),
          mustBeGreaterThanPrevious(this.carDetails.latestHistory?.mileage),
        ],
      ],
      cost: [null, [Validators.required, Validators.min(0)]],
      volume: [null, [Validators.required, Validators.min(1)]],
      costPerVolume: [{ value: null, disabled: true }],
      date: [
        null,
        [
          Validators.required,
          mustBeGreaterThanPrevious(
            this.carDetails.latestHistory?.date?.toDate()
          ),
        ],
      ],
      comments: [''],
    });
  }

  // watches for changes to volume and cost fields and update cost per volume
  private autoUpdateCostPerVolume(): void {
    const volume$ = this.addFuelForm.get('volume').valueChanges;
    const cost$ = this.addFuelForm.get('cost').valueChanges;
    combineLatest([volume$, cost$]).subscribe(([volume, cost]) => {
      let costPerVolume: number;
      if (volume <= 0) {
        costPerVolume = null;
      } else {
        // round to 2 decimal places
        costPerVolume = Math.round((cost / volume) * 100 * 100) / 100;
      }
      this.addFuelForm.patchValue({ costPerVolume });
    });
  }

  addFuel(): void {
    this.addFuelButton.disabled = true;
    this.databaseService
      .addFuel(this.addFuelForm.value, this.carDetails)
      .then(() => this.bottomSheetRef.dismiss())
      .catch(() => (this.addFuelButton.disabled = false));
  }

  onReset(): void {
    this.addFuelForm.reset();
  }

  onCancel(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
