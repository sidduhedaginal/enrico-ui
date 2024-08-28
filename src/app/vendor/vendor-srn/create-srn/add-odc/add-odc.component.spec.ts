import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOdcComponent } from './add-odc.component';

describe('AddOdcComponent', () => {
  let component: AddOdcComponent;
  let fixture: ComponentFixture<AddOdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOdcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
