import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardApproveDialogComponent } from './onboard-approve-dialog.component';

describe('OnboardApproveDialogComponent', () => {
  let component: OnboardApproveDialogComponent;
  let fixture: ComponentFixture<OnboardApproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardApproveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
