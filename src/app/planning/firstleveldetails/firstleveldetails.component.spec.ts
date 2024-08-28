import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstleveldetailsComponent } from './firstleveldetails.component';

describe('FirstleveldetailsComponent', () => {
  let component: FirstleveldetailsComponent;
  let fixture: ComponentFixture<FirstleveldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstleveldetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstleveldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
