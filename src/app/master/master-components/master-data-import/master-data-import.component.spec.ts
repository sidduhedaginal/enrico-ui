import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataImportComponent } from './master-data-import.component';

describe('MasterDataImportComponent', () => {
  let component: MasterDataImportComponent;
  let fixture: ComponentFixture<MasterDataImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
