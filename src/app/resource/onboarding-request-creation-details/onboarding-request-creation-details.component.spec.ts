import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRequestCreationDetailsComponent } from './onboarding-request-creation-details.component';

describe('OnboardingRequestCreationDetailsComponent', () => {
  let component: OnboardingRequestCreationDetailsComponent;
  let fixture: ComponentFixture<OnboardingRequestCreationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingRequestCreationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingRequestCreationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
