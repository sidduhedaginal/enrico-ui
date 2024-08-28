import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePermissionsOnBusinessRolesComponent } from './add-update-permissions-on-business-roles.component';

describe('AddUpdatePermissionsOnBusinessRolesComponent', () => {
  let component: AddUpdatePermissionsOnBusinessRolesComponent;
  let fixture: ComponentFixture<AddUpdatePermissionsOnBusinessRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdatePermissionsOnBusinessRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdatePermissionsOnBusinessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
