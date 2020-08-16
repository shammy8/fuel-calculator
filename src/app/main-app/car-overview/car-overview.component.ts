import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'firebase';

import { Car } from '../Car.model';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { AddDriverComponent } from '../add-driver/add-driver.component';
import { DeleteLatestFuellingWarningDialogComponent } from 'src/app/dialog-boxes/delete-latest-fuelling-warning-dialog.component';
import { DeleteCarWarningDialogComponent } from 'src/app/dialog-boxes/delete-car-warning-dialog.component';

@Component({
  selector: 'app-car-overview',
  templateUrl: './car-overview.component.html',
  styleUrls: ['./car-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOverviewComponent {
  @Input() carDetails: Car;
  @Input() user: User;

  avgMilesPerVolumeUpperLimit = 10;
  avgMilesPerVolumeLowerLimit = 5;

  avgPricePerMileUpperLimit = 0.5;
  avgPricePerMileLowerLimit = 0;

  constructor(
    private bottomSheet: MatBottomSheet,
    private router: Router,
    public dialog: MatDialog
  ) {}

  onAddFuel(): void {
    const addHistoryRef = this.bottomSheet.open(AddHistoryComponent, {
      data: { carDetails: this.carDetails, user: this.user },
      autoFocus: true,
    });

    // addHistoryRef.afterDismissed().subscribe(console.log);
  }

  onAddDriver(): void {
    const addDriverRef = this.bottomSheet.open(AddDriverComponent, {
      data: { carDetails: this.carDetails, user: this.user },
      autoFocus: true,
    });
  }

  // navigate to the history page of the selected car
  onHistory() {
    this.router.navigate([this.carDetails.docId, 'history']);
  }

  onDeleteLatestFuelling() {
    this.dialog.open(DeleteLatestFuellingWarningDialogComponent, {
      width: '500px',
      data: this.carDetails,
    });
  }

  onDeleteCar() {
    this.dialog.open(DeleteCarWarningDialogComponent, {
      width: '500px',
      data: this.carDetails,
    });
  }
}
