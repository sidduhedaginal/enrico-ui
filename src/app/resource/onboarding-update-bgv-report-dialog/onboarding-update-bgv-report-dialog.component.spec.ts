import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingUpdateBgvReportDialogComponent } from './onboarding-update-bgv-report-dialog.component';

describe('OnboardingUpdateBgvReportDialogComponent', () => {
  let component: OnboardingUpdateBgvReportDialogComponent;
  let fixture: ComponentFixture<OnboardingUpdateBgvReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingUpdateBgvReportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingUpdateBgvReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
