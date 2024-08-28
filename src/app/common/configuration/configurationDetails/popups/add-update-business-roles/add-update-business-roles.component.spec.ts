import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBusinessRolesComponent } from './add-update-business-roles.component';

describe('AddUpdateBusinessRolesComponent', () => {
  let component: AddUpdateBusinessRolesComponent;
  let fixture: ComponentFixture<AddUpdateBusinessRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBusinessRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateBusinessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
