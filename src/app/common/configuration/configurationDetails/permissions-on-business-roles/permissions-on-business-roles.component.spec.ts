import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsOnBusinessRolesComponent } from './permissions-on-business-roles.component';

describe('PermissionsOnBusinessRolesComponent', () => {
  let component: PermissionsOnBusinessRolesComponent;
  let fixture: ComponentFixture<PermissionsOnBusinessRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionsOnBusinessRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsOnBusinessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
