import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondleveldetailsComponent } from './secondleveldetails.component';

describe('SecondleveldetailsComponent', () => {
  let component: SecondleveldetailsComponent;
  let fixture: ComponentFixture<SecondleveldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondleveldetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondleveldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
