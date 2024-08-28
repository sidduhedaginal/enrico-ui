import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendLastWorkingDayDialogComponent } from './extend-last-working-day-dialog.component';

describe('ExtendLastWorkingDayDialogComponent', () => {
  let component: ExtendLastWorkingDayDialogComponent;
  let fixture: ComponentFixture<ExtendLastWorkingDayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendLastWorkingDayDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendLastWorkingDayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
