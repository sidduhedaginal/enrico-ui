import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersInBusinessRolesComponent } from './users-in-business-roles.component';

describe('UsersInBusinessRolesComponent', () => {
  let component: UsersInBusinessRolesComponent;
  let fixture: ComponentFixture<UsersInBusinessRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersInBusinessRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersInBusinessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
