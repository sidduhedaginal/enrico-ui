import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSowjdComponent } from './vendor-sowjd.component';

describe('VendorSowjdComponent', () => {
  let component: VendorSowjdComponent;
  let fixture: ComponentFixture<VendorSowjdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSowjdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSowjdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
