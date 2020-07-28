import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.scss'],
})
export class HistoriesComponent implements OnInit {
  carId$ = this.route.paramMap.pipe(map((param) => param.get('carId')));

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
