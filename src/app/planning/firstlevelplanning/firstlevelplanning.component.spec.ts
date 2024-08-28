import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstlevelplanningComponent } from './firstlevelplanning.component';

describe('FirstlevelplanningComponent', () => {
  let component: FirstlevelplanningComponent;
  let fixture: ComponentFixture<FirstlevelplanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstlevelplanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstlevelplanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
