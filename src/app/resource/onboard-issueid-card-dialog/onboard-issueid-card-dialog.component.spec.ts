import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardIssueidCardDialogComponent } from './onboard-issueid-card-dialog.component';

describe('OnboardIssueidCardDialogComponent', () => {
  let component: OnboardIssueidCardDialogComponent;
  let fixture: ComponentFixture<OnboardIssueidCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardIssueidCardDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardIssueidCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
