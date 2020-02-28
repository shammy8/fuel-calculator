import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainAppComponent } from './main-app.component';
import { AddCarComponent } from './add-car/add-car.component';

const routes: Routes = [
  {
    path: '',
    component: MainAppComponent,
    children: [{ path: 'add', component: AddCarComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainAppRoutingModule {}
