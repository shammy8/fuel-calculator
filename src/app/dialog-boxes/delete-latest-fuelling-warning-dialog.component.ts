import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Car } from '../main-app/Car.model';
import { DatabaseService } from '../main-app/database.service';

@Component({
  selector: 'app-delete-latest-fuelling-warning-dialog',
  template: `
    <h1 mat-dialog-title>Warning</h1>
    <div mat-dialog-content>
      Delete the latest fuelling on the
      {{ carDetails.latestHistory.date.toDate() | date: 'dd/MM/yyyy' }} of
      {{ carDetails.latestHistory.volume | number: '1.2-2' }} litres at £{{
        carDetails.latestHistory.cost | currency: 'GBP':''
      }}?
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
      <button mat-button (click)="onDelete()">
        Delete
      </button>
    </div>
  `,
  styles: ['.mat-dialog-actions {flex-direction: row-reverse}'],
})
export class DeleteLatestFuellingWarningDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteLatestFuellingWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carDetails: Car,
    private datebaseServce: DatabaseService
  ) {}

  onDelete() {
    this.datebaseServce.deleteLatestFuelling(this.carDetails);
  }
}