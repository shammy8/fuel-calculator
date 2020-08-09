import { Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { Car } from '../main-app/Car.model';
import { DatabaseService } from '../main-app/database.service';
import { Subscription } from 'rxjs';

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
      <button mat-button #deleteButton (click)="onDelete()">
        Delete
      </button>
    </div>
  `,
  styles: ['.mat-dialog-actions {flex-direction: row-reverse}'],
})
export class DeleteLatestFuellingWarningDialogComponent implements OnDestroy {
  deleteSub: Subscription;

  @ViewChild('deleteButton') deleteButton: MatButton;

  constructor(
    public dialogRef: MatDialogRef<DeleteLatestFuellingWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public carDetails: Car,
    private datebaseServce: DatabaseService
  ) {}

  onDelete() {
    this.deleteButton.disabled = true;
    this.deleteSub = this.datebaseServce
      .deleteLatestFuelling(this.carDetails)
      .subscribe(() => {
        this.dialogRef.close();
      });
    // .catch(() => (this.deleteButton.disabled = false));
  }

  ngOnDestroy() {
    this.deleteSub.unsubscribe();
  }
}
