import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSrnComponent } from './vendor-srn.component';

describe('VendorSrnComponent', () => {
  let component: VendorSrnComponent;
  let fixture: ComponentFixture<VendorSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
