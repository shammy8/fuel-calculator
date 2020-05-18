import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-efficiency-bar',
  templateUrl: './efficiency-bar.component.html',
  styleUrls: ['./efficiency-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EfficiencyBarComponent implements OnInit {
  @Input() value: number;
  @Input() unit: string;
  @Input() upperLimit: number;
  @Input() lowerLimit: number;

  valueAsPercentage: number;

  ngOnInit(): void {
    this.valueAsPercentage =
      ((this.value - this.lowerLimit) / (this.upperLimit - this.lowerLimit)) *
      100;
  }
}
