import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-app',
  template: ` <router-outlet></router-outlet> `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
