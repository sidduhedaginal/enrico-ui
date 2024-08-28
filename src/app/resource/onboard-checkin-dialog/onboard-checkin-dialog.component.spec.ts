import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCheckinDialogComponent } from './onboard-checkin-dialog.component';

describe('OnboardCheckinDialogComponent', () => {
  let component: OnboardCheckinDialogComponent;
  let fixture: ComponentFixture<OnboardCheckinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardCheckinDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardCheckinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
