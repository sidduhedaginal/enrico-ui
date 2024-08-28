import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignoffDetailsComponent } from './vendor-signoff-details.component';

describe('VendorSignoffDetailsComponent', () => {
  let component: VendorSignoffDetailsComponent;
  let fixture: ComponentFixture<VendorSignoffDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSignoffDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSignoffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
