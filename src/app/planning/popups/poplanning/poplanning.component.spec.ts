import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoplanningComponent } from './poplanning.component';

describe('PoplanningComponent', () => {
  let component: PoplanningComponent;
  let fixture: ComponentFixture<PoplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoplanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
