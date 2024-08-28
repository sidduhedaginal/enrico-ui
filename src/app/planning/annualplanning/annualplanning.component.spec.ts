import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualplanningComponent } from './annualplanning.component';

describe('AnnualplanningComponent', () => {
  let component: AnnualplanningComponent;
  let fixture: ComponentFixture<AnnualplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualplanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
