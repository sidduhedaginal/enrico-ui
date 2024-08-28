import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObDeletePopupComponent } from './ob-delete-popup.component';

describe('ObDeletePopupComponent', () => {
  let component: ObDeletePopupComponent;
  let fixture: ComponentFixture<ObDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
