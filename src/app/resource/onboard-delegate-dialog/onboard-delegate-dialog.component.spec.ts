import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardDelegateDialogComponent } from './onboard-delegate-dialog.component';

describe('OnboardDelegateDialogComponent', () => {
  let component: OnboardDelegateDialogComponent;
  let fixture: ComponentFixture<OnboardDelegateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardDelegateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardDelegateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
