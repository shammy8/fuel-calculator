import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoseAllDataWarningDialogComponent } from './lose-all-data-warning-dialog.component';

describe('ErrorDialogComponent', () => {
  let component: LoseAllDataWarningDialogComponent;
  let fixture: ComponentFixture<LoseAllDataWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoseAllDataWarningDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoseAllDataWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
