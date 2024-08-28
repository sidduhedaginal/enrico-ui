import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceNoNRateCardTMComponent } from './add-resource-non-rate-card-tm.component';

describe('AddResourceNoNRateCardTMComponent', () => {
  let component: AddResourceNoNRateCardTMComponent;
  let fixture: ComponentFixture<AddResourceNoNRateCardTMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddResourceNoNRateCardTMComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddResourceNoNRateCardTMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
