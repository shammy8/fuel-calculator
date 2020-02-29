import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
})
export class AddCarComponent implements OnInit {
  addCarForm: FormGroup;
  engines;
  logos;

  constructor(private fb: FormBuilder, private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.addCarForm = this.fb.group({
      carName: ['', [Validators.required]],
      logo: '',
      engineType: '',
      date: ['', [Validators.required]],
      mileage: [
        null,
        [Validators.required, Validators.min(0), Validators.max(9999999)],
      ],
    });

    this.afs
      .doc('general/ui')
      .valueChanges()
      .pipe(
        map((res: { engineTypes: []; logos: [] }) => {
          this.engines = res.engineTypes;
          this.logos = res.logos;
        })
      )
      .subscribe();
  }

  submitForm() {}
}
