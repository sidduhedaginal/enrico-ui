import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePlanComponent } from './resource-plan.component';

describe('ResourcePlanComponent', () => {
  let component: ResourcePlanComponent;
  let fixture: ComponentFixture<ResourcePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcePlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
