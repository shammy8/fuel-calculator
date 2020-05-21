import { Component, OnInit, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { Car } from '../Car.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrls: ['./add-history.component.scss'],
})
export class AddHistoryComponent implements OnInit {
  addFuelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddHistoryComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public carDetails: Car
  ) {}

  ngOnInit(): void {
    this.addFuelForm = this.fb.group({
      mileage: [this.carDetails.latestHistory.mileage, [Validators.required]],
      volume: [null, [Validators.required]],
      cost: [null, [Validators.required]],
      date: [new Date(), [Validators.required]],
      comments: [''],
    });
  }

  addFuel() {}

  onReset() {
    this.addFuelForm.reset();
  }

  onCancel(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
