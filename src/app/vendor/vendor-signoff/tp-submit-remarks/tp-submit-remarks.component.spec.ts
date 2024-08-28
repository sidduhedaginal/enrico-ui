import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpSubmitRemarksComponent } from './tp-submit-remarks.component';

describe('TpSubmitRemarksComponent', () => {
  let component: TpSubmitRemarksComponent;
  let fixture: ComponentFixture<TpSubmitRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpSubmitRemarksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TpSubmitRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
