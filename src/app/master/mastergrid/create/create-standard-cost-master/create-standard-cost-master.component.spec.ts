import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStandardCostMasterComponent } from './create-standard-cost-master.component';

describe('CreateStandardCostMasterComponent', () => {
  let component: CreateStandardCostMasterComponent;
  let fixture: ComponentFixture<CreateStandardCostMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStandardCostMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStandardCostMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
