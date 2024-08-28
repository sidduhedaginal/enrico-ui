import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRequestInformationDetailsComponent } from './onboarding-request-information-details.component';

describe('OnboardingRequestInformationDetailsComponent', () => {
  let component: OnboardingRequestInformationDetailsComponent;
  let fixture: ComponentFixture<OnboardingRequestInformationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingRequestInformationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingRequestInformationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
