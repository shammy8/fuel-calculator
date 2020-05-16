import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-app',
  template: ` <app-car-overview></app-car-overview> `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
