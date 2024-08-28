import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceMasterViewTableAgComponent } from './resource-master-view-table-ag.component';

describe('ResourceMasterViewTableAgComponent', () => {
  let component: ResourceMasterViewTableAgComponent;
  let fixture: ComponentFixture<ResourceMasterViewTableAgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceMasterViewTableAgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceMasterViewTableAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
