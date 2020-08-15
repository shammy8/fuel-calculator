import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Subscription } from 'rxjs';

import { Car } from '../Car.model';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
})
export class AddDriverComponent implements OnInit, OnDestroy {
  addDriverForm: FormGroup;
  addDriverCloudFunctionSub: Subscription;

  @ViewChild('addDriverButton') addDriverButton: MatButton;

  constructor(
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddDriverComponent>,
    private fns: AngularFireFunctions,
    private snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public carDetails: Car
  ) {}

  ngOnInit(): void {
    this.addDriverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // todo add typing, handle error, dismiss isn't working, add confirmation toast
  async onAddDriver() {
    this.addDriverButton.disabled = true;

    try {
      const addDriverCloudFunction = this.fns.httpsCallable('addDriver');
      const res = await addDriverCloudFunction({
        email: this.addDriverForm.value.email,
        carDoc: this.carDetails,
      }).toPromise(); // keeping as observable makes the app act strange

      this.bottomSheetRef.dismiss();

      this.snackBar.open(res, 'Close', {
        duration: 5000,
      });
    } catch (err) {
      this.addDriverButton.disabled = false;

      this.snackBar.open(err, 'Close', {
        duration: 5000,
      });
    }
  }

  onReset(): void {
    this.addDriverForm.reset();
  }

  onCancel(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }

  ngOnDestroy() {
    // this.addDriverCloudFunctionSub?.unsubscribe();
  }
}
