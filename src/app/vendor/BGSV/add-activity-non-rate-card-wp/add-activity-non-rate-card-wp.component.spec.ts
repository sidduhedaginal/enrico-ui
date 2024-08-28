import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityNonRateCardWpComponent } from './add-activity-non-rate-card-wp.component';

describe('AddActivityNonRateCardWpComponent', () => {
  let component: AddActivityNonRateCardWpComponent;
  let fixture: ComponentFixture<AddActivityNonRateCardWpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivityNonRateCardWpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActivityNonRateCardWpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
