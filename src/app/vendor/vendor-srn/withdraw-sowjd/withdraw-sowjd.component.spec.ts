import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawSOWJDComponent } from './withdraw-sowjd.component';

describe('WithdrawSOWJDComponent', () => {
  let component: WithdrawSOWJDComponent;
  let fixture: ComponentFixture<WithdrawSOWJDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawSOWJDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawSOWJDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
