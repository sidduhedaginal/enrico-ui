import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseLineItemComponent } from './create-purchase-line-item.component';

describe('CreatePurchaseLineItemComponent', () => {
  let component: CreatePurchaseLineItemComponent;
  let fixture: ComponentFixture<CreatePurchaseLineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseLineItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePurchaseLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
