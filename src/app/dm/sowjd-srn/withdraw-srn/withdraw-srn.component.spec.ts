import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawSrnComponent } from './withdraw-srn.component';

describe('WithdrawSrnComponent', () => {
  let component: WithdrawSrnComponent;
  let fixture: ComponentFixture<WithdrawSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
