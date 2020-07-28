import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Car } from '../Car.model';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { AddDriverComponent } from '../add-driver/add-driver.component';

@Component({
  selector: 'app-car-overview',
  templateUrl: './car-overview.component.html',
  styleUrls: ['./car-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOverviewComponent {
  @Input() carDetails: Car;

  avgMilesPerVolumeUpperLimit = 10;
  avgMilesPerVolumeLowerLimit = 5;

  avgPricePerMileUpperLimit = 0.5;
  avgPricePerMileLowerLimit = 0;

  constructor(private bottomSheet: MatBottomSheet, private router: Router) {}

  onAddFuel(): void {
    const addHistoryRef = this.bottomSheet.open(AddHistoryComponent, {
      data: this.carDetails,
      autoFocus: true,
    });

    // addHistoryRef.afterDismissed().subscribe(console.log);
  }

  onAddDriver(): void {
    const addDriverRef = this.bottomSheet.open(AddDriverComponent, {
      data: { docId: this.carDetails.docId, drivers: this.carDetails.drivers },
      autoFocus: true,
    });
  }

  // navigate to the history page of the selected car
  onHistory() {
    this.router.navigate([this.carDetails.docId, 'history']);
  }
}
