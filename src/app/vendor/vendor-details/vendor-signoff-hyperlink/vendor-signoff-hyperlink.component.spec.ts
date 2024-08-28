import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignoffHyperlinkComponent } from './vendor-signoff-hyperlink.component';

describe('VendorSignoffHyperlinkComponent', () => {
  let component: VendorSignoffHyperlinkComponent;
  let fixture: ComponentFixture<VendorSignoffHyperlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSignoffHyperlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSignoffHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
