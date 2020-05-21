import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { DatabaseService } from '../database.service';
import { UIElements } from '../Car.model';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
})
export class AddCarComponent implements OnInit {
  addCarForm: FormGroup;

  uiElements$: Observable<UIElements> = this.databaseService.uiElements$;

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private bottomSheetRef: MatBottomSheetRef<AddCarComponent>
  ) {}

  ngOnInit(): void {
    this.addCarForm = this.fb.group({
      name: ['', [Validators.required]],
      logo: '',
      engineType: '',
    });
  }

  addVehicle(): void {
    this.databaseService.addVehicle(this.addCarForm.value).then((res) => {
      if (!res) {
        return;
      }
      this.bottomSheetRef.dismiss();
      // this.router.navigate(['']);
    });
  }

  onReset() {
    this.addCarForm.reset();
  }

  onCancel(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }
}
