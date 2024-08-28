import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseHeaderMasterComponent } from './create-purchase-header-master.component';

describe('CreatePurchaseHeaderMasterComponent', () => {
  let component: CreatePurchaseHeaderMasterComponent;
  let fixture: ComponentFixture<CreatePurchaseHeaderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePurchaseHeaderMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePurchaseHeaderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
