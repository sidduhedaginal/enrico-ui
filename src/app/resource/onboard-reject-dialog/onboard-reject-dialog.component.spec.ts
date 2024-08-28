import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardRejectDialogComponent } from './onboard-reject-dialog.component';

describe('OnboardRejectDialogComponent', () => {
  let component: OnboardRejectDialogComponent;
  let fixture: ComponentFixture<OnboardRejectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardRejectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
