import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityRateCardWpComponent } from './add-activity-rate-card-wp.component';

describe('AddActivityRateCardWpComponent', () => {
  let component: AddActivityRateCardWpComponent;
  let fixture: ComponentFixture<AddActivityRateCardWpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivityRateCardWpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActivityRateCardWpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
