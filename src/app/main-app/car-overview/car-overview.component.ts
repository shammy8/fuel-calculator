import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Car } from '../Car.model';

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
}
