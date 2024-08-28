import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeMasterComponent } from './create-employee-master.component';

describe('CreateEmployeeMasterComponent', () => {
  let component: CreateEmployeeMasterComponent;
  let fixture: ComponentFixture<CreateEmployeeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
