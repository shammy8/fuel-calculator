import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from 'firebase';
import { Subscription } from 'rxjs';

import { Car } from '../Car.model';
import { EmailDriverDialogComponent } from 'src/app/dialog-boxes/email-driver-dialog.component';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
})
export class AddDriverComponent implements OnInit {
  addDriverForm: FormGroup;
  addDriverCloudFunctionSub: Subscription;

  @ViewChild('addDriverButton') addDriverButton: MatButton;

  constructor(
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddDriverComponent>,
    private fns: AngularFireFunctions,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { carDetails: Car; user: User }
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
        carDoc: this.data.carDetails,
      }).toPromise(); // keeping as observable makes the app act strange

      this.bottomSheetRef.dismiss();

      if (res !== 'Driver not sign up') {
        // display a snackbar with the message from the cloud function
        this.snackBar.open(res, 'Close', {
          duration: 5000,
        });
      } else {
        // if driver hasn't signed up for app then open dialog asking if user want to send an email to driver
        this.dialog.open(EmailDriverDialogComponent, {
          width: '500px',
          data: {
            email: this.addDriverForm.value.email,
            carDetails: this.data.carDetails,
            user: this.data.user,
          },
        });
      }
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
}
