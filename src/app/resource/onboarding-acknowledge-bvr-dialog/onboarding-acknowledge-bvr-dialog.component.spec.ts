import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingAcknowledgeBvrDialogComponent } from './onboarding-acknowledge-bvr-dialog.component';

describe('OnboardingAcknowledgeBvrDialogComponent', () => {
  let component: OnboardingAcknowledgeBvrDialogComponent;
  let fixture: ComponentFixture<OnboardingAcknowledgeBvrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingAcknowledgeBvrDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingAcknowledgeBvrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
