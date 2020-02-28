import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppRoutingModule } from './main-app-routing.module';
import { MainAppComponent } from './main-app.component';
import { CarDrawerComponent } from './car-drawer/car-drawer.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MainAppComponent, CarDrawerComponent],
  imports: [CommonModule, SharedModule, MainAppRoutingModule],
})
export class MainAppModule {}
