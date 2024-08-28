import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningApprovalProcessLineComponent } from './planning-approval-process-line.component';

describe('PlanningApprovalProcessLineComponent', () => {
  let component: PlanningApprovalProcessLineComponent;
  let fixture: ComponentFixture<PlanningApprovalProcessLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningApprovalProcessLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningApprovalProcessLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
