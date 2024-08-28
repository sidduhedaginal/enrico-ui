import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceRateCardTmComponent } from './add-resource-rate-card-tm.component';

describe('AddResourceRateCardTmComponent', () => {
  let component: AddResourceRateCardTmComponent;
  let fixture: ComponentFixture<AddResourceRateCardTmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResourceRateCardTmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceRateCardTmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
