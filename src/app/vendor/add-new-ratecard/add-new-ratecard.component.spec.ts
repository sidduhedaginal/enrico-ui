import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRatecardComponent } from './add-new-ratecard.component';

describe('AddNewRatecardComponent', () => {
  let component: AddNewRatecardComponent;
  let fixture: ComponentFixture<AddNewRatecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewRatecardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewRatecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
