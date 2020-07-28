import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-car-drawer>
      <router-outlet></router-outlet>
    </app-car-drawer>
  `,
  styles: [],
})
export class AppComponent {}
