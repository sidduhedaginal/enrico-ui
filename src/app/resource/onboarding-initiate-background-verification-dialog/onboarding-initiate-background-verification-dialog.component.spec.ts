import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingInitiateBackgroundVerificationDialogComponent } from './onboarding-initiate-background-verification-dialog.component';

describe('OnboardingInitiateBackgroundVerificationDialogComponent', () => {
  let component: OnboardingInitiateBackgroundVerificationDialogComponent;
  let fixture: ComponentFixture<OnboardingInitiateBackgroundVerificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingInitiateBackgroundVerificationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingInitiateBackgroundVerificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
