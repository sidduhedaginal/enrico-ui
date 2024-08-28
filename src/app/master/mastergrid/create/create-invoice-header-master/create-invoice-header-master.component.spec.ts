import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceHeaderMasterComponent } from './create-invoice-header-master.component';

describe('CreateInvoiceHeaderMasterComponent', () => {
  let component: CreateInvoiceHeaderMasterComponent;
  let fixture: ComponentFixture<CreateInvoiceHeaderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvoiceHeaderMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInvoiceHeaderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
