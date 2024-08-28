import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingExtendDateOfJoiningDialogComponent } from './onboarding-extend-date-of-joining-dialog.component';

describe('OnboardingExtendDateOfJoiningDialogComponent', () => {
  let component: OnboardingExtendDateOfJoiningDialogComponent;
  let fixture: ComponentFixture<OnboardingExtendDateOfJoiningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingExtendDateOfJoiningDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingExtendDateOfJoiningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
