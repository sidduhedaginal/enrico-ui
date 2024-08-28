import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRfqDetailComponent } from './vendor-rfq-detail.component';

describe('VendorRfqDetailComponent', () => {
  let component: VendorRfqDetailComponent;
  let fixture: ComponentFixture<VendorRfqDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRfqDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorRfqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
