import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorMasterComponent } from './create-vendor-master.component';

describe('CreateVendorMasterComponent', () => {
  let component: CreateVendorMasterComponent;
  let fixture: ComponentFixture<CreateVendorMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVendorMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVendorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
