import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardShareNtidDialogComponent } from './onboard-share-ntid-dialog.component';

describe('OnboardShareNtidDialogComponent', () => {
  let component: OnboardShareNtidDialogComponent;
  let fixture: ComponentFixture<OnboardShareNtidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardShareNtidDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardShareNtidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
