import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Car } from '../main-app/Car.model';

@Component({
  selector: 'app-email-driver-dialog',
  template: `
    <h1 mat-dialog-title>Driver doesn't exist</h1>
    <div mat-dialog-content>
      The driver you want to add has not sign up to use this app. Click "Email
      Driver" if you want to send the driver an email. Or "Cancel" to notify the
      driver yourself.
    </div>
    <div class="buttons" mat-dialog-actions>
      <button mat-raised-button color="primary" (click)="onEmailDriver()">
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

  async onEmailDriver() {
    try {
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
      this.snackBar.open(`Error: ${err}`, 'Close', {
        duration: 5000,
      });
    }
  }
}
