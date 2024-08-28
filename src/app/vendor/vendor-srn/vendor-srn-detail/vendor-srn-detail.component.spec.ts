import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSrnDetailComponent } from './vendor-srn-detail.component';

describe('VendorSrnDetailComponent', () => {
  let component: VendorSrnDetailComponent;
  let fixture: ComponentFixture<VendorSrnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSrnDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSrnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
