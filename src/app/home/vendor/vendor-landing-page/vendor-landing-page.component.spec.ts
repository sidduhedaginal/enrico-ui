import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorLandingPageComponent } from './vendor-landing-page.component';

describe('VendorLandingPageComponent', () => {
  let component: VendorLandingPageComponent;
  let fixture: ComponentFixture<VendorLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
