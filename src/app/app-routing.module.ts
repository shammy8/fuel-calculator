import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { LoginComponent } from './login/login.component';
import { MainAppComponent } from './main-app/main-app.component';
import { AddCarComponent } from './main-app/add-car/add-car.component';

const routes: Routes = [
  {
    path: '',
    component: MainAppComponent,
    ...canActivate(() => redirectUnauthorizedTo(['login'])),
    children: [{ path: 'add', component: AddCarComponent }],
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo([''])),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
