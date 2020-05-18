import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Car } from '../Car.model';

@Component({
  selector: 'app-car-overview',
  templateUrl: './car-overview.component.html',
  styleUrls: ['./car-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOverviewComponent implements OnInit {
  @Input() carDetails: Car;

  avgMilesPerVolumeUpperLimit = 10;
  avgMilesPerVolumeLowerLimit = 5;
  avgMilesPerVolumePercentage: number;

  constructor() {}

  ngOnInit(): void {
    this.avgMilesPerVolumePercentage =
      ((this.carDetails.latestHistory.avgMilesPerVolume -
        this.avgMilesPerVolumeLowerLimit) /
        (this.avgMilesPerVolumeUpperLimit - this.avgMilesPerVolumeLowerLimit)) *
      100;
  }
}
