import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoschRateCardMasterComponent } from './create-bosch-rate-card-master.component';

describe('CreateBoschRateCardMasterComponent', () => {
  let component: CreateBoschRateCardMasterComponent;
  let fixture: ComponentFixture<CreateBoschRateCardMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBoschRateCardMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBoschRateCardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
