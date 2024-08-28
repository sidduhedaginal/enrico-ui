import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateDeBoardingDialogComponent } from './initiate-de-boarding-dialog.component';

describe('InitiateDeBoardingDialogComponent', () => {
  let component: InitiateDeBoardingDialogComponent;
  let fixture: ComponentFixture<InitiateDeBoardingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateDeBoardingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiateDeBoardingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
