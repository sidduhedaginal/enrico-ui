import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorDetailsComponent } from './edit-vendor-details.component';

describe('EditVendorDetailsComponent', () => {
  let component: EditVendorDetailsComponent;
  let fixture: ComponentFixture<EditVendorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVendorDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
