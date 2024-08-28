import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEntityAdminComponent } from './add-update-entity-admin.component';

describe('AddUpdateEntityAdminComponent', () => {
  let component: AddUpdateEntityAdminComponent;
  let fixture: ComponentFixture<AddUpdateEntityAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateEntityAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateEntityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
