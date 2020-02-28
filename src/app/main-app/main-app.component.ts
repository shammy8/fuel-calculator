import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-app',
  template: `
    <app-car-drawer>
      <!--For the main-app-routing module -->
      <router-outlet></router-outlet>
    </app-car-drawer>
  `,
  styles: [],
})
export class MainAppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
