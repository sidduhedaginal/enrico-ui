import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonApprovalComponent } from './common-approval.component';

describe('CommonApprovalComponent', () => {
  let component: CommonApprovalComponent;
  let fixture: ComponentFixture<CommonApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
