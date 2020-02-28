import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-drawer',
  templateUrl: './car-drawer.component.html',
  styleUrls: ['./car-drawer.component.scss'],
})
export class CarDrawerComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  addCar() {
    this.router.navigate(['add']);
  }
}
