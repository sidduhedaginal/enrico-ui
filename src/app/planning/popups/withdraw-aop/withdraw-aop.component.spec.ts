import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawAOPComponent } from './withdraw-aop.component';

describe('WithdrawAOPComponent', () => {
  let component: WithdrawAOPComponent;
  let fixture: ComponentFixture<WithdrawAOPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawAOPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawAOPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
