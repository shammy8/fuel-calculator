import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { Car } from '../main-app/Car.model';
import { DatabaseService } from '../main-app/database.service';

@Component({
  selector: 'app-delete-car-warning-dialog',
  template: `
    <h1 mat-dialog-title>Warning</h1>
    <div mat-dialog-content>
      Permanently delete {{ carDetails.name }} and all related fuelling history?
    </div>
    <div class="buttons" mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        mat-dialog-close
        cdkFocusInitial
      >
        Cancel
      </button>
      <button mat-button #deleteButton (click)="onDelete()">
        Delete
      </button>
    </div>
  `,
  styles: ['.mat-dialog-actions {flex-direction: row-reverse}'],
})
export class DeleteCarWarningDialogComponent {
  @ViewChild('deleteButton') deleteButton: MatButton;

  constructor(
    public dialogRef: MatDialogRef<DeleteCarWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carDetails: Car,
    private datebaseServce: DatabaseService
  ) {}

  onDelete() {
    this.deleteButton.disabled = true;
    this.datebaseServce
      .deleteCar(this.carDetails)
      .then(() => {
        this.dialogRef.close();
      })
      .catch(() => (this.deleteButton.disabled = false));
  }
}
