import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAdminComponent } from './entity-admin.component';

describe('EntityAdminComponent', () => {
  let component: EntityAdminComponent;
  let fixture: ComponentFixture<EntityAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
