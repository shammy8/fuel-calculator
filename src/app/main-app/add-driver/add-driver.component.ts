import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';

import { DatabaseService } from '../database.service';
import { Car } from '../Car.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
})
export class AddDriverComponent implements OnInit, OnDestroy {
  addDriverForm: FormGroup;
  addDriverCloudFunctionSub: Subscription;

  @ViewChild('addDriverButton') addDriverButton: MatButton;

  constructor(
    private databaseService: DatabaseService,
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<AddDriverComponent>,
    private fns: AngularFireFunctions,
    @Inject(MAT_BOTTOM_SHEET_DATA) public carDetails: Car
  ) {}

  ngOnInit(): void {
    this.addDriverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // todo add typing, handle error, dismiss isn't working, add confirmation toast
  onAddDriver() {
    this.addDriverButton.disabled = true;

    const addDriverCloudFunction = this.fns.httpsCallable('addDriver');
    this.addDriverCloudFunctionSub = addDriverCloudFunction({
      email: this.addDriverForm.value.email,
      carDoc: this.carDetails,
    }).subscribe({
      next: () => {
        this.bottomSheetRef.dismiss();
      },
      error: (err) => {
        this.addDriverButton.disabled = false;
        console.log(err);
      },
    });
    // this.bottomSheetRef.dismiss();
  }

  onReset(): void {
    this.addDriverForm.reset();
  }

  onCancel(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault(); // copying the docs
  }

  ngOnDestroy() {
    this.addDriverCloudFunctionSub.unsubscribe();
  }
}
