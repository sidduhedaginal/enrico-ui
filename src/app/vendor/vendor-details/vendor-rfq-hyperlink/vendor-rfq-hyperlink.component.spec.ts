import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRfqHyperlinkComponent } from './vendor-rfq-hyperlink.component';

describe('VendorRfqHyperlinkComponent', () => {
  let component: VendorRfqHyperlinkComponent;
  let fixture: ComponentFixture<VendorRfqHyperlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRfqHyperlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorRfqHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
