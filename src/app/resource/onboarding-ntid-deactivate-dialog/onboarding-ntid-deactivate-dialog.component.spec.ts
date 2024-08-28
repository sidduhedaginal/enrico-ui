import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingNtidDeactivateDialogComponent } from './onboarding-ntid-deactivate-dialog.component';

describe('OnboardingNtidDeactivateDialogComponent', () => {
  let component: OnboardingNtidDeactivateDialogComponent;
  let fixture: ComponentFixture<OnboardingNtidDeactivateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingNtidDeactivateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingNtidDeactivateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
