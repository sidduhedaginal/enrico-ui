import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitOnboardingRequestDialogComponent } from './submit-onboarding-request-dialog.component';

describe('SubmitOnboardingRequestDialogComponent', () => {
  let component: SubmitOnboardingRequestDialogComponent;
  let fixture: ComponentFixture<SubmitOnboardingRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitOnboardingRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitOnboardingRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
