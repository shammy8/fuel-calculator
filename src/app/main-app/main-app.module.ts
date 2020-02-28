import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppRoutingModule } from './main-app-routing.module';
import { MainAppComponent } from './main-app.component';
import { CarDrawerComponent } from './car-drawer/car-drawer.component';
import { SharedModule } from '../shared/shared.module';
import { AddCarComponent } from './add-car/add-car.component';

@NgModule({
  declarations: [MainAppComponent, CarDrawerComponent, AddCarComponent],
  imports: [CommonModule, SharedModule, MainAppRoutingModule],
})
export class MainAppModule {}
