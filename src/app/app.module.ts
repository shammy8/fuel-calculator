import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CarDrawerComponent,
    DashboardComponent,
    AddCarComponent,
    CarOverviewComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
