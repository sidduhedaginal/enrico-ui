import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqTechEvaluationComponent } from './rfq-tech-evaluation.component';

describe('RfqTechEvaluationComponent', () => {
  let component: RfqTechEvaluationComponent;
  let fixture: ComponentFixture<RfqTechEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqTechEvaluationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqTechEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
