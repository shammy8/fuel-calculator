import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
})
export class AddCarComponent implements OnInit {
  addCarForm: FormGroup;
  engines;
  logos;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.addCarForm = this.fb.group({
      name: ['', [Validators.required]],
      logo: '',
      engineType: '',
      date: ['', [Validators.required]],
      mileage: [
        null,
        [Validators.required, Validators.min(0), Validators.max(9999999)],
      ],
    });

    this.databaseService
      .fetchUiElements()
      .pipe(
        map((res: { engineTypes: []; logos: [] }) => {
          this.engines = res.engineTypes;
          this.logos = res.logos;
        })
      )
      .subscribe();
  }

  addVehicle() {
    this.databaseService.addVehicle(this.addCarForm.value);
  }
}
