import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';

import { DatabaseService } from '../database.service';
import { Car } from '../Car.model';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
})
export class AddDriverComponent implements OnInit {
  addDriverForm: FormGroup;

  @ViewChild('addDriverButton') addDriverButton: MatButton;

  constructor(
    private databaseService: DatabaseService,
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddDriverComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public carDetails: Car
  ) {}

  ngOnInit(): void {
    this.addDriverForm = this.fb.group({
      uidOrEmail: ['', [Validators.required]],
    });
  }

  // todo add typing, handle error, allow adding driver by email
  onAddDriver() {
    this.addDriverButton.disabled = true;
    this.databaseService
      .addDriver(this.addDriverForm.value.uidOrEmail, this.carDetails)
      .then(() => this.bottomSheetRef.dismiss())
      .catch((err) => {
        this.addDriverButton.disabled = false;
        console.log(err);
      });
  }

  onReset(): void {
    this.addDriverForm.reset();
  }

  onCancel(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
