import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMasterFormComponent } from './vendor-master-form.component';

describe('VendorMasterFormComponent', () => {
  let component: VendorMasterFormComponent;
  let fixture: ComponentFixture<VendorMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
