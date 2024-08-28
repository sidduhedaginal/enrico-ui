import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCostCenterMasterComponent } from './create-cost-center-master.component';

describe('CreateCostCenterMasterComponent', () => {
  let component: CreateCostCenterMasterComponent;
  let fixture: ComponentFixture<CreateCostCenterMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCostCenterMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCostCenterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
