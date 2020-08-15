import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { FuelHistory } from '../Car.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-histories',
  templateUrl: './histories.component.html',
  styleUrls: ['./histories.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HistoriesComponent implements OnInit {
  history$: Observable<FuelHistory[]>;
  dataSource: MatTableDataSource<FuelHistory>;
  expandedElement: FuelHistory | null;
  displayedColumns: string[] = [
    'date',
    'mileage',
    'cost',
    'volume',
    'mileageSinceRecordsBegan',
    'volumeSinceRecordsBegan',
    'costSinceRecordsBegan',
    'avgPricePerMile',
    'avgMilesPerVolume',
    'addedBy',
  ];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit(): void {
    // get the carId from the url params and then use it to call firestore for all
    // the history of that car and order them by mileage
    this.history$ = this.route.paramMap.pipe(
      map((param) => param.get('carId')),
      switchMap((carId) =>
        this.afs
          .collection<FuelHistory>(`cars/${carId}/history`, (ref) =>
            ref.where('mileage', '>', 0).orderBy('mileage', 'desc')
          )
          .valueChanges()
      )
    );

    this.history$.subscribe((history) => {
      this.dataSource = new MatTableDataSource(history);
      this.dataSource.sort = this.sort;
    });
  }

  // drag to reorder table columns
  // todo save the column order for user
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
}
