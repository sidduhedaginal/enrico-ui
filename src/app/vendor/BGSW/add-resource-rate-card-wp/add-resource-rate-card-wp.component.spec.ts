import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceRateCardWpComponent } from './add-resource-rate-card-wp.component';

describe('AddResourceRateCardWpComponent', () => {
  let component: AddResourceRateCardWpComponent;
  let fixture: ComponentFixture<AddResourceRateCardWpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResourceRateCardWpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceRateCardWpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
