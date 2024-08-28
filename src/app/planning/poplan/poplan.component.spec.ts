import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoplanComponent } from './poplan.component';

describe('PoplanComponent', () => {
  let component: PoplanComponent;
  let fixture: ComponentFixture<PoplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoplanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
