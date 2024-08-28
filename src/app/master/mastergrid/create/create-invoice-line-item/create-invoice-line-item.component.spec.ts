import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceLineItemComponent } from './create-invoice-line-item.component';

describe('CreateInvoiceLineItemComponent', () => {
  let component: CreateInvoiceLineItemComponent;
  let fixture: ComponentFixture<CreateInvoiceLineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvoiceLineItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInvoiceLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
