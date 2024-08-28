import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatRfqComponent } from './float-rfq.component';

describe('FloatRfqComponent', () => {
  let component: FloatRfqComponent;
  let fixture: ComponentFixture<FloatRfqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatRfqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
