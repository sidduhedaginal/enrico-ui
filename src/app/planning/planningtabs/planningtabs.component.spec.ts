import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningtabsComponent } from './planningtabs.component';

describe('PlanningtabsComponent', () => {
  let component: PlanningtabsComponent;
  let fixture: ComponentFixture<PlanningtabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningtabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningtabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
