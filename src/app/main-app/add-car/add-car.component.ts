import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
})
export class AddCarComponent implements OnInit {
  addCarForm: FormGroup;
  engines = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
  ];
  logos = ['🚗', '🚓', '🏎', '🚘', '🚕', '🛺', '🚙', '🚌', '🚐'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addCarForm = this.fb.group({
      carName: ['', [Validators.required]],
      logo: '',
      engineType: '',
      date: ['', [Validators.required]],
      mileage: [
        '',
        [Validators.required, Validators.min(0), Validators.max(9999999)],
      ],
    });

    this.addCarForm.valueChanges.subscribe(console.log);
  }

  submitForm() {}
}
