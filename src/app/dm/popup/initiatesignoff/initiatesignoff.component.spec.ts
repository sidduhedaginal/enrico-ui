import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatesignoffComponent } from './initiatesignoff.component';

describe('InitiatesignoffComponent', () => {
  let component: InitiatesignoffComponent;
  let fixture: ComponentFixture<InitiatesignoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatesignoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiatesignoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
