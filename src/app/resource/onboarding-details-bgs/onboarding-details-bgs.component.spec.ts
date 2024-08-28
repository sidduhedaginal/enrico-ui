import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingDetailsBgsComponent } from './onboarding-details-bgs.component';

describe('OnboardingDetailsBgsComponent', () => {
  let component: OnboardingDetailsBgsComponent;
  let fixture: ComponentFixture<OnboardingDetailsBgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingDetailsBgsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingDetailsBgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
