import { Component, Inject, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Car } from '../main-app/Car.model';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-email-driver-dialog',
  template: `
    <h1 mat-dialog-title>Driver doesn't exist</h1>
    <div mat-dialog-content>
      {{ data.email }} has not sign up to use this app. Click "Email Driver" if
      you want to send an email to {{ data.email }} to recommend this app. Or
      click "Cancel" to notify the driver yourself.
    </div>
    <div class="buttons" mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        (click)="onEmailDriver()"
        #emailDriverButton
      >
        Email Driver
      </button>
      <button mat-button mat-dialog-close>
        Cancel
      </button>
    </div>
  `,
  styles: ['.mat-dialog-actions {flex-direction: row-reverse}'],
})
export class EmailDriverDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailDriverDialogComponent>,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: { email: string; carDetails: Car; user: User }
  ) {}

  @ViewChild('emailDriverButton') emailDriverButton: MatButton;

  async onEmailDriver() {
    try {
      this.emailDriverButton.disabled = true;
      const res = await this.afs.collection('mail').add({
        to: this.data.email,
        template: {
          name: 'addFuel',
          data: {
            displayName: this.data.user.displayName,
          },
        },
      });
      this.snackBar.open(`Email sent to ${this.data.email}`, 'Close', {
        duration: 5000,
      });
      this.dialogRef.close();
    } catch (err) {
      this.emailDriverButton.disabled = false;
      this.snackBar.open(`Error: ${err}`, 'Close', {
        duration: 5000,
      });
    }
  }
}
