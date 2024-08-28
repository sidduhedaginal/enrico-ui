import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRolesComponent } from './business-roles.component';

describe('BusinessRolesComponent', () => {
  let component: BusinessRolesComponent;
  let fixture: ComponentFixture<BusinessRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
