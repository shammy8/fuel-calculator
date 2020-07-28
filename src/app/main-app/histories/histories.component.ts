import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { FuelHistory } from '../Car.model';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.scss'],
})
export class HistoriesComponent implements OnInit {
  history$: Observable<FuelHistory[]>;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit(): void {
    // get the carId from the url params and then use it to call firestore for all
    // the history of that car and order them by mileage
    this.history$ = this.route.paramMap.pipe(
      map((param) => param.get('carId')),
      switchMap((carId) =>
        this.afs
          .collection<FuelHistory>(`cars/${carId}/history`, (ref) =>
            ref.where('mileage', '>', 0).orderBy('mileage')
          )
          .valueChanges()
      )
    );
  }
}
