import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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

  @Output() cancel = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private router: Router
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
      this.onCancel();
      // this.router.navigate(['']);
    });
  }

  onReset() {
    this.addCarForm.reset();
  }

  onCancel() {
    this.cancel.emit();
  }
}
