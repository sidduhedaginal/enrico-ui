import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVendorContactConfirmationComponent } from './delete-vendor-contact-confirmation.component';

describe('DeleteVendorContactConfirmationComponent', () => {
  let component: DeleteVendorContactConfirmationComponent;
  let fixture: ComponentFixture<DeleteVendorContactConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVendorContactConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteVendorContactConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
