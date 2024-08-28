import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardUpdateNtidDialogComponent } from './onboard-update-ntid-dialog.component';

describe('OnboardUpdateNtidDialogComponent', () => {
  let component: OnboardUpdateNtidDialogComponent;
  let fixture: ComponentFixture<OnboardUpdateNtidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardUpdateNtidDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardUpdateNtidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
