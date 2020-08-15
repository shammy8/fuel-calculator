import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import 'firebase/firestore';
import 'firebase/auth';

import { environment } from '../environments/environment';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CarDrawerComponent } from './main-app/car-drawer/car-drawer.component';
import { DashboardComponent } from './main-app/dashboard.component';
import { AddCarComponent } from './main-app/add-car/add-car.component';
import { CarOverviewComponent } from './main-app/car-overview/car-overview.component';
import { EfficiencyBarComponent } from './main-app/efficiency-bar/efficiency-bar.component';
import { AddHistoryComponent } from './main-app/add-history/add-history.component';
import { LoseAllDataWarningDialogComponent } from './dialog-boxes/lose-all-data-warning-dialog.component';
import { AddDriverComponent } from './main-app/add-driver/add-driver.component';
import { HistoriesComponent } from './main-app/histories/histories.component';
import { DeleteLatestFuellingWarningDialogComponent } from './dialog-boxes/delete-latest-fuelling-warning-dialog.component';
import { DeleteCarWarningDialogComponent } from './dialog-boxes/delete-car-warning-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CarDrawerComponent,
    DashboardComponent,
    AddCarComponent,
    CarOverviewComponent,
    EfficiencyBarComponent,
    AddHistoryComponent,
    LoseAllDataWarningDialogComponent,
    AddDriverComponent,
    HistoriesComponent,
    DeleteLatestFuellingWarningDialogComponent,
    DeleteCarWarningDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthGuardModule,
    AngularFireFunctionsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
