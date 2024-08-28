import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRequestCreationBgsvComponent } from './onboarding-request-creation-bgsv.component';

describe('OnboardingRequestCreationBgsvComponent', () => {
  let component: OnboardingRequestCreationBgsvComponent;
  let fixture: ComponentFixture<OnboardingRequestCreationBgsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingRequestCreationBgsvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingRequestCreationBgsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
