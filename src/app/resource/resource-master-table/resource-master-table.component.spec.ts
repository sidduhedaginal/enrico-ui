import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceMasterTableComponent } from './resource-master-table.component';

describe('ResourceMasterTableComponent', () => {
  let component: ResourceMasterTableComponent;
  let fixture: ComponentFixture<ResourceMasterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceMasterTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceMasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
