import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorContactDetailsComponent } from './create-vendor-contact-details.component';

describe('CreateVendorContactDetailsComponent', () => {
  let component: CreateVendorContactDetailsComponent;
  let fixture: ComponentFixture<CreateVendorContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVendorContactDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVendorContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
