import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EfficiencyBarComponent } from './efficiency-bar.component';

describe('EfficiencyBarComponent', () => {
  let component: EfficiencyBarComponent;
  let fixture: ComponentFixture<EfficiencyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfficiencyBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfficiencyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
