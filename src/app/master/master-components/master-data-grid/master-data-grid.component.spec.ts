import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataGridComponent } from './master-data-grid.component';

describe('MasterDataGridComponent', () => {
  let component: MasterDataGridComponent;
  let fixture: ComponentFixture<MasterDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
