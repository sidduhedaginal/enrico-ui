import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationpopupComponent } from './confirmationpopup.component';

describe('ConfirmationpopupComponent', () => {
  let component: ConfirmationpopupComponent;
  let fixture: ComponentFixture<ConfirmationpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
