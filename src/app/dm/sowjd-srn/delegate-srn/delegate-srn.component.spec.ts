import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateSrnComponent } from './delegate-srn.component';

describe('DelegateSrnComponent', () => {
  let component: DelegateSrnComponent;
  let fixture: ComponentFixture<DelegateSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegateSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
