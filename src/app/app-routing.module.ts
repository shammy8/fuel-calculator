import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './main-app/dashboard.component';
import { AddCarComponent } from './main-app/add-car/add-car.component';

const routes: Routes = [
  {
    path: '',
    // ...canActivate(() => redirectUnauthorizedTo(['login'])),
    children: [
      { path: '', component: DashboardComponent },
      { path: 'add', component: AddCarComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    // ...canActivate(() => redirectLoggedInTo([''])),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
