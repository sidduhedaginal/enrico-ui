import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportsummaryComponent } from './importsummary.component';

describe('ImportsummaryComponent', () => {
  let component: ImportsummaryComponent;
  let fixture: ComponentFixture<ImportsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
