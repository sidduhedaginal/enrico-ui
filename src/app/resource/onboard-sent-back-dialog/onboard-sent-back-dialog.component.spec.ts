import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardSentBackDialogComponent } from './onboard-sent-back-dialog.component';

describe('OnboardSentBackDialogComponent', () => {
  let component: OnboardSentBackDialogComponent;
  let fixture: ComponentFixture<OnboardSentBackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardSentBackDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardSentBackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
