import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Car } from '../Car.model';
import { AddHistoryComponent } from '../add-history/add-history.component';

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

  constructor(private bottomSheet: MatBottomSheet) {}

  onAddFuel() {
    const addHistoryRef = this.bottomSheet.open(AddHistoryComponent, {
      data: this.carDetails,
    });

    addHistoryRef.afterDismissed().subscribe(console.log);
  }
}
