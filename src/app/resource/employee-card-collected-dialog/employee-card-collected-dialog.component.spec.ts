import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCardCollectedDialogComponent } from './employee-card-collected-dialog.component';

describe('EmployeeCardCollectedDialogComponent', () => {
  let component: EmployeeCardCollectedDialogComponent;
  let fixture: ComponentFixture<EmployeeCardCollectedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCardCollectedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCardCollectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
