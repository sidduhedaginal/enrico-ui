import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignoffComponent } from './vendor-signoff.component';

describe('VendorSignoffComponent', () => {
  let component: VendorSignoffComponent;
  let fixture: ComponentFixture<VendorSignoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSignoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSignoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
