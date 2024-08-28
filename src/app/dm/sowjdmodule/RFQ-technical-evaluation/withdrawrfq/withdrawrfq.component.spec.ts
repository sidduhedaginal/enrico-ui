import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawrfqComponent } from './withdrawrfq.component';

describe('WithdrawrfqComponent', () => {
  let component: WithdrawrfqComponent;
  let fixture: ComponentFixture<WithdrawrfqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawrfqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawrfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
