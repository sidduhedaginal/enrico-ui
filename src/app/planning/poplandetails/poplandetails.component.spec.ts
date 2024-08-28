import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoplandetailsComponent } from './poplandetails.component';

describe('PoplandetailsComponent', () => {
  let component: PoplandetailsComponent;
  let fixture: ComponentFixture<PoplandetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoplandetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoplandetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
