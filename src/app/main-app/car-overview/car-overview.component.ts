import { Component, OnInit, Input } from '@angular/core';
import { Car } from '../Car.model';

@Component({
  selector: 'app-car-overview',
  templateUrl: './car-overview.component.html',
  styleUrls: ['./car-overview.component.scss'],
})
export class CarOverviewComponent implements OnInit {
  @Input() carDetails: Car;

  constructor() {}

  ngOnInit(): void {}
}
