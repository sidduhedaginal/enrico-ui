import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluaterfqComponent } from './evaluaterfq.component';

describe('EvaluaterfqComponent', () => {
  let component: EvaluaterfqComponent;
  let fixture: ComponentFixture<EvaluaterfqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluaterfqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluaterfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
