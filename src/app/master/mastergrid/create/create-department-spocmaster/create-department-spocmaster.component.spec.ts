import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepartmentSPOCMasterComponent } from './create-department-spocmaster.component';

describe('CreateDepartmentSPOCMasterComponent', () => {
  let component: CreateDepartmentSPOCMasterComponent;
  let fixture: ComponentFixture<CreateDepartmentSPOCMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDepartmentSPOCMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDepartmentSPOCMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
