import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './main-app/dashboard.component';
import { HistoriesComponent } from './main-app/histories/histories.component';
import { SettingsComponent } from './main-app/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    ...canActivate(() => redirectUnauthorizedTo(['login'])),
    children: [
      { path: '', component: DashboardComponent },
      { path: ':carId/history', component: HistoriesComponent },
      { path: 'settings', component: SettingsComponent },
    ],
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
