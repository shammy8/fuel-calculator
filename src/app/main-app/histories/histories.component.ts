import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, debounceTime } from 'rxjs/operators';
import { Observable, Subscription, Subject } from 'rxjs';
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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { FuelHistory } from '../Car.model';
import { DatabaseService } from '../database.service';

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
export class HistoriesComponent implements OnInit, OnDestroy {
  history$: Observable<FuelHistory[]>;
  historySub: Subscription;
  userDocSub: Subscription;
  updateSub: Subscription;

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
  updateColumnInFirestore$ = new Subject<string[]>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private databaseService: DatabaseService
  ) {}

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

    this.historySub = this.history$.subscribe((history) => {
      this.dataSource = new MatTableDataSource(history);
      this.dataSource.sort = this.sort;
    });

    // get the saved column order from Firestore
    this.userDocSub = this.databaseService.userDoc$.subscribe(
      (userDoc) =>
        (this.displayedColumns = userDoc.tableColumns ?? this.displayedColumns)
    );

    this.updateSub = this.updateColumnInFirestore$
      .pipe(
        debounceTime(5000), // update every 5 seconds
        // distinctUntilChanged(), not working fully + seem like it's working with distinctUntilChange in it right now
        switchMap((columns) => {
          return this.databaseService.saveColumnOrder(columns);
        })
      )
      .subscribe();
  }

  // drag to reorder table columns
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );

    // update the firestore with the new column order
    this.updateColumnInFirestore$.next(this.displayedColumns);
  }

  ngOnDestroy() {
    this.historySub.unsubscribe();
    this.userDocSub.unsubscribe();
    this.updateSub.unsubscribe();
  }
}
