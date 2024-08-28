import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillingPeriodMasterComponent } from './create-billing-period-master.component';

describe('CreateBillingPeriodMasterComponent', () => {
  let component: CreateBillingPeriodMasterComponent;
  let fixture: ComponentFixture<CreateBillingPeriodMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBillingPeriodMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBillingPeriodMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
