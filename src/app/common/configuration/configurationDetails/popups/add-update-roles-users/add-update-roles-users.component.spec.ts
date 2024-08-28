import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRolesUsersComponent } from './add-update-roles-users.component';

describe('AddUpdateRolesUsersComponent', () => {
  let component: AddUpdateRolesUsersComponent;
  let fixture: ComponentFixture<AddUpdateRolesUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateRolesUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateRolesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
